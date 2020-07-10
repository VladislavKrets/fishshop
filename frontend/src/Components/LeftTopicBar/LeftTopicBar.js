import * as React from "react";
import './LeftTopicBar.css'

export default class LeftTopicBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'view-left-topic-bar'} style={{
                backgroundColor: 'cornflowerblue',
                width: '300px',
                minWidth: '300px',
                marginLeft: '10px',
                padding: '12px',
                marginTop: '45px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                borderRadius: '3px',
            }}>
                {this.props.children}
            </div>
        )
    }
}