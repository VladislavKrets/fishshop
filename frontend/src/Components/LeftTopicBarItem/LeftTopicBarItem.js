import * as React from "react";
import './LeftTopicBarItem.css'
import addIcon from '../../icons/add_icon.svg'
import minusIcon from '../../icons/minus.svg'

export default class LeftTopicBarItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedClassName: ''
        }

    }

    componentDidMount() {
        if (this.props.expand) this.expandFilter()
    }

    expandFilter = (e) => {
        if (e) e.stopPropagation()
        if (this.state.expandedClassName) {
            this.setState({
                expandedClassName: ''
            })
        } else {
            this.setState({
                expandedClassName: ' expanded-topic-bar-item'
            })
        }
    }

    render() {
        return (
            <div style={{
                position: 'relative',
                marginTop: this.props.marginLeft === 0 ? '20px' : '5px',
                width: '100%'
            }} onClick={this.expandFilter}>
                <div style={{
                    cursor: 'pointer',
                    borderRadius: '5px',
                    padding: '12px',
                    boxSizing: 'border-box',
                    color: 'cornflowerblue',
                    backgroundColor: '#c4e4ff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: `${this.props.marginLeft}px`
                }}>
                    <label style={{
                        width: '100%', display: 'flex',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                    }}>
                        <div>{this.props.name}</div>
                        <div>{!this.props.items ? <input style={{transform: 'scale(1.5)'}}
                                                         checked={!!this.props.checked}
                                                         name={this.props.id}
                                                         onChange={this.props.switchMobileTopic}
                                                         type={'checkbox'}/> : this.state.expandedClassName === '' ?
                            <img style={{width: '20px', height: '20px'}} src={addIcon}/> :
                            <img style={{width: '20px', height: '15px'}} src={minusIcon}/>}</div>
                    </label>
                </div>
                {this.props.items ?
                    <div className={'topic-bar-list' + this.state.expandedClassName}>
                        <div style={{
                            cursor: 'pointer',
                            borderRadius: '5px',
                            padding: '12px',
                            marginTop: '5px',
                            boxSizing: 'border-box',
                            color: 'cornflowerblue',
                            backgroundColor: '#c4e4ff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginLeft: `${this.props.marginLeft + 10}px`
                        }}>
                            <label style={{
                                width: '100%', display: 'flex',
                                justifyContent: 'space-between', cursor: 'pointer'
                            }} onClick={e => e.stopPropagation()}>
                                <div>Выбрать все</div>
                                <div><input style={{transform: 'scale(1.5)'}}
                                            checked={!!this.props.checked}
                                            name={this.props.id}
                                            onChange={this.props.switchMobileTopic}
                                            type={'checkbox'}/></div>
                            </label>
                        </div>
                        {
                            this.props.items.map((elem, index) => {
                                return <LeftTopicBarItem marginLeft={this.props.marginLeft + 10}
                                                         checked={elem.checked}
                                                         switchMobileTopic={this.props.switchMobileTopic}
                                                         id={elem.id}
                                                         items={elem.children} name={elem.name}/>
                            })}
                    </div> : null}
            </div>
        )
    }
}