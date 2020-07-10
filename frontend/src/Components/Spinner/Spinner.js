import * as React from "react";
import './Spinner.css'

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.style ? this.props.style : {};
        return (
            <div style={{marginTop: '100px', textAlign: 'center', ...style}}>
                <div className="lds-ring">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        )
    }
}