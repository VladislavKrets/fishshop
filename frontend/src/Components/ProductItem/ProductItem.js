import * as React from "react";
import './ProductItem.css'
import trashIcon from '../../icons/trash.svg'

export default class ProductItem extends React.Component {
    constructor(props) {
        super(props);
    }

    addToBasket = () => {
        const selectedItems = this.props.selectedItems;
        selectedItems.push({id: this.props.currentId, count: 1});
        this.props.changeSelectedItems(selectedItems);
    }

    removeFromBasket = () => {
        let selectedItems = this.props.selectedItems;
        selectedItems = selectedItems.filter(x => x.id !== this.props.currentId)
        this.props.changeSelectedItems(selectedItems);
    }

    render() {
        return (
            <div style={{paddingRight: '10px', cursor: 'pointer'}}>
                <div className={'product-item'}>
                    <div className={'product-photo'}>
                        <img className={'photo'} src={this.props.imageUrl}/>
                    </div>
                    <div style={{
                        padding: '4px 0'
                    }}>
                        {this.props.selectedItems.map(x => x.id).includes(this.props.currentId) ?
                            <span onClick={e => {
                                e.stopPropagation();
                                this.removeFromBasket();
                            }} style={{

                                fontSize: '25px', backgroundColor: 'red',
                                padding: '5px 7px',
                                paddingBottom: '3px',
                                borderRadius: '5px',
                                color: 'white',
                            }}>
                            <img src={trashIcon} style={{width: '22px', height: '22px'}}/>
                        </span> :
                            <span onClick={e => {
                                e.stopPropagation();
                                this.addToBasket();
                            }} style={{
                                fontSize: '25px', backgroundColor: 'green',
                                padding: '3px 10px',
                                borderRadius: '5px',
                                color: 'white',
                            }}>
                            +
                        </span>
                        }
                    </div>
                    <div style={{wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '74px'}}>{this.props.children}</div>
                </div>
            </div>
        )
    }
}