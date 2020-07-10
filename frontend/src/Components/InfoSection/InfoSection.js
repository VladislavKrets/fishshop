import * as React from "react";
import './InfoSection.css'

export default class InfoSection extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.style ? this.props.style : {}
        return (
            <div className={'view-info-section'
            + (this.props.className ? ` ${this.props.className}` : '')} style={{...style}}>
                {this.props.children}
            </div>
        )
    }
}