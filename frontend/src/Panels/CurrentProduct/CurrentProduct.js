import * as React from "react";
import axios from '../../api'
import Spinner from "../../Components/Spinner/Spinner";
import notFound from '../../icons/not-found.png'
import './CurrentProduct.css'
import trashIcon from '../../icons/trash.svg'

export default class CurrentProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            loading: true,
        }
    }

    componentWillUnmount() {
        window.onpopstate = () => {
        }
    }

    componentDidMount() {
        window.onpopstate = () => this.props.setCurrentId(null);
        const id = this.props.id
        axios.get(`/items/${id}/`).then(data => {
            this.setState({
                product: data.data,
                loading: false
            })
        })
    }

    addToBasket = () => {
        const selectedItems = this.props.selectedItems;
        selectedItems.push({id: this.props.id, count: 1});
        this.props.changeSelectedItems(selectedItems);
    }

    removeFromBasket = () => {
        let selectedItems = this.props.selectedItems;
        selectedItems = selectedItems.filter(x => x.id !== this.props.id)
        this.props.changeSelectedItems(selectedItems);
    }

    render() {
        return (
            this.state.loading ? <Spinner/> :
                <div style={{paddingTop: '10px'}} className={'current-product-view-item'}>
                    <div className={'back-desktop'} onClick={() => this.props.setCurrentId(null)}>
                        <span style={{
                            transform: 'scaleX(0.6)',
                        }}>{'<'}</span><span> Назад</span>
                    </div>
                    <div style={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        textAlign: 'center',
                        fontSize: '1.4em',
                        fontWeight: 'bold',
                        color: 'cornflowerblue'
                    }}>{this.state.product.name}
                    </div>
                    <div className={'prod-description'}>

                        <div className={'product-photo current-product'}>
                            <img className={'photo'}
                                 style={{width: '300px', height: '300px', borderRadius: '50%'}}
                                 src={this.state.product.photo ? this.state.product.photo : notFound}/>
                            {this.props.selectedItems.map(x => x.id).includes(this.props.id) ?
                                <div style={{
                                    padding: '10px 0',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <div onClick={e => {
                                        e.stopPropagation();
                                        this.removeFromBasket();
                                    }} style={{
                                        backgroundColor: 'red',
                                        padding: '10px 10px',
                                        borderRadius: '5px',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '190px',
                                        cursor: 'pointer'
                                    }}>
                                        <img src={trashIcon}
                                             style={{width: '22px', height: '22px'}}/>
                                        <div style={{
                                            lineHeight: '25px',
                                            paddingLeft: '10px'
                                        }}>Удалить из корзины
                                        </div>
                                    </div>
                                </div> :
                                <div style={{
                                    padding: '10px 0',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <div onClick={e => {
                                        e.stopPropagation();
                                        this.addToBasket();
                                    }} style={{
                                        backgroundColor: 'green',
                                        padding: '10px 10px',
                                        borderRadius: '5px',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '190px',
                                        cursor: 'pointer'
                                    }}>
                                        <span style={{fontSize: '25px',}}>+</span>
                                        <div style={{
                                            lineHeight: '25px',
                                            paddingLeft: '10px'
                                        }}>Добавить в корзину
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div style={{flexGrow: '1', padding: '10px 12px', textAlign: 'center'}}>
                            <div
                                style={{textAlign: 'left'}}>
                                <b>Цена{this.state.product.price && this.state.product.unit && ` за ${this.state.product.unit}`}:
                                </b> {this.state.product.price ? this.state.product.price + " руб." : "Не указана"}
                            </div>
                            <div style={{textAlign: 'left'}}><b>Описание:</b></div>
                            <div>
                                {this.state.product.description ? null : "Не указано"}
                            </div>
                            <div
                                style={{textAlign: 'left'}}
                                dangerouslySetInnerHTML={{__html: this.state.product.description
                                        ? this.state.product.description : null}}>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}