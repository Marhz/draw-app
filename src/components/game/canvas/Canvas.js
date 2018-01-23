import React, { Component } from 'react';
import './Canvas.css';
import socket from '../../../utils/socket';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.ctx = null;
        this.drawing = false;
        this.mouseX = null;
        this.mouseY = null;
        this.lines = [];
        this.lineInterval = setInterval(() => {
            if (this.lines.length === 0) return;
            socket.emit('new_lines', {lines: this.lines, gameId: this.props.gameId});
            this.lines = [];
        }, 100);
        socket.emit('join_game', this.props.gameId);      
    }
    render() {
        return (
            <div ref="canvas-container" className="canvas-container">
                <canvas
                    ref="canvas"
                    onMouseMove={this._onMouseMove}
                    onTouchMove={this._onMouseMove}
                    onMouseDown={this.mouseDown}
                    onTouchStart={this.mouseDown}
                    onMouseUp={this.mouseUp}
                    onTouchEnd={this.mouseUp}
                    onMouseLeave={this.mouseUp}
                ></canvas>
                {/* <button onClick={this.clearCanvas}>Clear</button> */}
            </div>
        )
    }

    componentDidMount() {            
        const ctx = this.refs.canvas.getContext('2d');
        const container = this.refs['canvas-container'];
        console.log(container.clientWidth);
        ctx.canvas.width = container.clientWidth;
        ctx.canvas.height = ctx.canvas.width * 2 / 3;
        console.log(ctx.canvas.width);
        this.ctx = ctx;
        this.container = container;
        this.startSocketChannels(socket);
        window.addEventListener('resize', () => {
            // ctx.canvas.width = container.clientWidth;
            // ctx.canvas.height = ctx.canvas.width * 2 / 3;
            // socket.emit('get_current_lines');     
        })
        console.log(this.props.gameId);
    }

    componentWillUnmount() {
        socket.off('draw');
        socket.off('current_lines');
        socket.off('clear_canvas');
        clearInterval(this.lineInterval);
    }

    getCoordinates(e) {
        let coords = {}
        if (e.touches) {
            coords = { x: e.touches[0].clientX + window.pageXOffset, y: e.touches[0].clientY + + window.pageYOffset };
        } else {
            coords = { x: e.pageX, y: e.pageY };
        }
        coords.x = (coords.x - this.container.offsetLeft) / this.ctx.canvas.width;
        coords.y = (coords.y - this.container.offsetTop) / this.ctx.canvas.height;
        return coords;
    }

    _onMouseMove = (e) => {
        if (!this.drawing) return;
        const { x, y } = this.getCoordinates(e);
        const oldX = this.mouseX;
        const oldY = this.mouseY;
        const lineInfo = { oldX, oldY, x, y, lineWidth: this.props.lineWidth, color: this.props.color };
        this.draw(lineInfo);
        this.lines.push(lineInfo);
        this.mouseX = x;
        this.mouseY = y;
    }

    mouseDown = (e) => {
        const {x, y} = this.getCoordinates(e);
        const lineInfo = { oldX: x, oldY: y, x, y, lineWidth: this.props.lineWidth, color: this.props.color };
        this.draw(lineInfo);
        this.lines.push(lineInfo);
        this.mouseX = x;
        this.mouseY = y;
        this.drawing = true;
    }

    mouseUp = (e) => {
        this.drawing = false;
    }

    draw({ oldX, oldY, x, y, lineWidth, color }) {
        if (oldX == null || oldY == null) return;
        oldX *= this.ctx.canvas.width;
        oldY *= this.ctx.canvas.height;
        x *= this.ctx.canvas.width;
        y *= this.ctx.canvas.height;
        this.ctx.save();
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = (window.innerWidth < 500) ? lineWidth / 2 : lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.beginPath();
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
        socket.on('clear_canvas', () => {
            console.log('clear');
            this.clearCanvas(false);
        })
        socket.on('game_over', () => {
            console.log('game_over');
            this.clearCanvas(false);
        })
        socket.emit('get_current_lines', this.props.gameId);
        socket.on('current_lines', data => {
            console.log(data);
            const { lines } = data;
            lines.forEach(line => {
                this.draw(line);
            });
        });
        socket.on('draw', (lines) => {
            console.log(lines);
            lines.forEach(line => {
                this.draw(line);
            });
        });
    }
}

export default Canvas;
