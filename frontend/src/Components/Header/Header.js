import * as React from "react";
import './Header.css'

export default class Header extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.style ? this.props.style : {};
        return (
            <div style={{...style}} className={'view-header'}>
                {this.props.title}
            </div>
        )
    }
}