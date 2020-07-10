import * as React from "react";
import './MobileSearchTopic.css'

export default class MobileSearchTopic extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.style ? this.props.style : {};
        return (
            <div style={{
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column-reverse',
                width: '100%',
                height: '100%',
                zIndex: 2,
            }} onClick={this.props.onClose}>
                <div className={'topic-canvas'} style={{
                    backGroundColor: 'white',
                    padding: '12px',
                    boxSizing: 'border-box',
                    width: '100%',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    maxHeight: '85%',
                    overflowY: 'scroll'
                }} onClick={e => e.stopPropagation()}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '20px',
                    }}>
                        <span style={{color: 'cornflowerblue'}} onClick={this.props.goBack}>
                            Назад
                        </span>
                        <div>
                            <span style={{color: 'cornflowerblue', paddingRight: '10px'}}
                                  onClick={this.props.reset}>Сбросить</span>
                            <span style={{color: 'red', fontSize: '1.2em', marginRight: '7px'}}
                                  onClick={this.props.onClose}>
                            х
                        </span>
                        </div>
                    </div>
                    <div>{this.props.children}</div>
                    <div className={'mobile'} style={{height: '52px'}}></div>
                </div>
            </div>
        )
    }
}