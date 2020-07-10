import * as React from "react";
import './HorizontalScroll.css'

export default class HorizontalScroll extends React.Component {
    constructor(props) {
        super(props);
    }

    onWheel = e => {
        e.preventDefault();
        const container = document.getElementById(this.props.id);
        const containerScrollPosition = document.getElementById(this.props.id).scrollLeft;
        container.scrollTo({
            top: 0,
            left: containerScrollPosition + e.deltaY,
            behaviour: "smooth"
        });
    };

    render() {
        const style = this.props.style ? this.props.style : {};
        return (
            <div className={'view-horizontal'} style={style}>
                <div className={'view-horizontal-title'}>{this.props.title}</div>
                <div id={this.props.id} className={'view-horizontal-scroll'} onWheel={this.onWheel}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}