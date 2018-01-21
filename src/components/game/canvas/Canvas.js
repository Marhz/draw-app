import React, { Component } from 'react';
import './Canvas.css';
import _ from 'lodash';
import socket from '../../../utils/socket';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.ctx = null;
        this.drawing = false;
        this.mouseX = null;
        this.mouseY = null;
        this.lines = [];
        this.sendLine = _.debounce(this.sendLine.bind(this), 50, { leading: true, maxWait: 50 });
        
        this.lineInterval = setInterval(() => {
            if (this.lines.length === 0) return;
            socket.emit('new_lines', this.lines);
            this.lines = [];
        }, 100);

        // this.throttledMouseMove = _.debounce(this.throttledMouseMove.bind(this), 50, { leading: true, maxWait: 50 });        
    }
    render() {
        return (
            <div ref="canvas-container" className="canvas-container">
                <canvas 
                    ref="canvas" 
                    onMouseMove={this._onMouseMove}
                    onMouseDown={this.mouseDown} 
                    onMouseUp={this.mouseUp}
                    onMouseLeave={this.mouseUp}
                ></canvas>
                <button onClick={this.clearCanvas}>Clear</button>
            </div>
        )
    }
    componentDidMount() {
        const ctx = this.refs.canvas.getContext('2d');
        const container = this.refs['canvas-container'];

        ctx.canvas.width = container.offsetWidth;
        ctx.canvas.height = ctx.canvas.width * 2 / 3;
        this.ctx = ctx;
        this.container = container;
        this.startSocketChannels(socket);
    }

    componentWillUnmount() {
        socket.off('draw');
        socket.off('current_lines');
        socket.off('clear_canvas');
        clearInterval(this.lineInterval);
    }

    throttledMouseMove(e) {
        const x = (e.pageX - this.container.offsetLeft) / this.ctx.canvas.width;
        const y = (e.pageY - this.container.offsetTop) / this.ctx.canvas.height;
        if (this.drawing){
            const oldX = this.mouseX / this.ctx.canvas.width;
            const oldY = this.mouseY / this.ctx.canvas.height;
            const lineInfo = { oldX, oldY, x, y, lineWidth: this.props.lineWidth, color: this.props.color };
            this.draw(lineInfo);
            this.lines.push(lineInfo);
            // this.sendLine(lineInfo)
            // socket.emit('new_line', lineInfo);
        }
        this.mouseX = x * this.ctx.canvas.width;
        this.mouseY = y * this.ctx.canvas.height;
    }

    sendLine(line) {
        this.lineInterval = setInterval(() => {
            socket.emit('new_line', line);
        }, 1000);
    }

    _onMouseMove = (e) => {
        e.persist();
        this.throttledMouseMove(e);
    }
    mouseDown = (e) => {
        const lineInfo = {
            oldX: this.mouseX / this.ctx.canvas.width,
            oldY: this.mouseY / this.ctx.canvas.height,
            x: (this.mouseX) / this.ctx.canvas.width,
            y: (this.mouseY) / this.ctx.canvas.height,
            lineWidth: this.props.lineWidth,
            color: this.props.color
        };
        this.draw(lineInfo);
        this.drawing = true;
        this.lines.push(lineInfo);
        // socket.emit('new_line', lineInfo);        
    }
    mouseUp = (e) => {
        this.drawing =  false;
    }
    draw({oldX, oldY, x, y, lineWidth, color}) {
        if (oldX == null || oldY == null) return;
        oldX *= this.ctx.canvas.width;
        oldY = oldY * this.ctx.canvas.height;
        x = x * this.ctx.canvas.width;
        y = y * this.ctx.canvas.height;

        this.ctx.save();
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.lineWidth = (window.innerWidth < 500) ? lineWidth / 2 : lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.moveTo(oldX, oldY);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
    clearCanvas = (emit = true) => {
        this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        if (emit) {
            socket.emit('clear');
        }
    }
    startSocketChannels(socket) {
        socket.on('init', (data) => {
            const { lines } = data;
            console.log('first_draw');
            lines.forEach(line => {
                this.draw(line);
            });
        })
        socket.on('clear_canvas', () => {
            console.log('clear');
            this.clearCanvas(false);
        })
        socket.on('game_over', () => {
            console.log('game_over');
            this.clearCanvas(false);
        })
        socket.emit('get_current_lines');
        socket.on('current_lines', data => {
            console.log(data);
            const { lines } = data;
            lines.forEach(line => {
                this.draw(line);
            });
        });
        socket.on('draw', lines => {
            lines.forEach(line => {
                this.draw(line);
            });
        });
    }
}

export default Canvas;
