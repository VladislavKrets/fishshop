import * as React from "react";
import './Search.css'

export default class LeftTopicBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.style ? this.props.style : {};
        return (
            <div className={'search-input'} style={{...style}}>
                <input style={{
                    outline: 'none',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                }}
                       placeholder={this.props.placeholder}
                       onChange={this.props.onChange}
                       value={this.props.value}
                       autoComplete={false}
                       type={'text'}/>
            </div>
        )
    }
}