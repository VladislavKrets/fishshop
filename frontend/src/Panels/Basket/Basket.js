import * as React from "react";
import View from "../../Components/View/View";
import axios from "../../api";
import Spinner from "../../Components/Spinner/Spinner";
import InfoSection from "../../Components/InfoSection/InfoSection";
import './Basket.css'
import notFound from '../../icons/not-found.png'
import trashIcon from "../../icons/trash.svg";
import backArrow from "../../icons/back-arrow.svg";
import CurrentProduct from "../CurrentProduct/CurrentProduct";

export default class Basket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            next: null,
            previous: null,
            page: 1,
            currentId: null
        }
    }

    componentDidMount() {
        if (this.props.selectedItems.length > 0) {
            this.loadData()
        } else this.setState({
            loading: false
        })
    }

    loadData = (selectedItems, url) => {
        const items = selectedItems ? selectedItems.map(x => x.id) : this.props.selectedItems.map(x => x.id);
        this.setState({
            loading: true
        })
        return axios.post(url ? url : '/items/', {pk__in: items}, {
            headers: {},
        }).then(data => {
            const page = !data.data.previous ? 1 :
                !data.data.next ? parseInt(data.data.previous.split('=')[1]) + 1
                    : parseInt(data.data.next.split('=')[1]) - 1

            for (let i = 0; i < data.data.results.length; i++) {
                data.data.results[i].count = 1;
            }

            this.setState({
                items: data.data.results,
                next: data.data.next,
                previous: data.data.previous,
                count: data.data.count,
                loading: false,
                page: page
            })
        })
    }

    changeElemCount = (id, coeff) => {
        const items = this.props.selectedItems;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                if (items[i].count + coeff * 1 > 0) {
                    items[i].count = items[i].count + coeff * 1;
                }
                break
            }
        }
        this.props.changeSelectedItems(items);

    }

    removeFromBasket = (id) => {
        let selectedItems = this.props.selectedItems;
        selectedItems = selectedItems.filter(x => x.id !== id)
        this.props.changeSelectedItems(selectedItems);
        this.loadData(selectedItems);
    }

    setCurrentId = (id) => {
        if (id !== null) {
            window.history.pushState({}, 'product', `/products/${id}/`)
        }
        this.loadData()
        this.setState({
            currentId: id
        })
    }
    getItemCount = (elem) => {
        const curr = this.props.selectedItems.filter(x => x.id === elem.id)[0]
        return curr ? curr.count : null
    }
    render() {
        let totalSum = 0;
        if (this.state.items.length > 0)
            this.props.selectedItems.forEach((x, index) => {
                const price = this.state.items.filter(elem => elem.id === x.id)[0].price;
                if (price) {
                    totalSum += price * x.count;
                }
            })

        return (
            !this.state.currentId ? <View current={'basket'} title={'Корзина'}>
                    {this.state.loading ? <Spinner/> :
                        <>
                            {this.props.selectedItems.length === 0 ?
                                <div style={{marginTop: '50px', textAlign: 'center'}}>Ни одного товара
                                    еще не добавлено</div> :
                                <div>
                                    <div className={'basket-total-sum'} style={{
                                        textAlign: 'center',
                                        fontSize: '1.5em',
                                        fontWeight: 800,
                                    }}>
                                        Итоговая сумма: {totalSum} руб.
                                    </div>
                                    <div className={'basket-elem-list'}>
                                    {
                                        this.state.items.map((elem, index) => {
                                            return <InfoSection>
                                                <div style={{
                                                    display: 'flex',
                                                    cursor: 'pointer',
                                                    justifyContent: 'space-between'
                                                }} onClick={() => this.setCurrentId(elem.id)}>
                                                    <div>
                                                        <div>
                                                            <img className={'image basket-image'}
                                                                 src={elem.photo ? elem.photo : notFound}/>
                                                        </div>
                                                        <div className={'basket-elem-name'} style={{
                                                            textAlign: 'center',
                                                            fontFamily: "'Balsamiq Sans', cursive, 'Arial'",
                                                            color: 'cornflowerblue', fontWeight: 'bold'
                                                        }}>
                                                            {elem.name}
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        paddingLeft: '20px',
                                                        paddingTop: '20px',
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}>
                                                                <div style={{
                                                                    padding: '5px 12px',
                                                                    backgroundColor: 'cornflowerblue',
                                                                    color: 'white',
                                                                    borderRadius: '5px',
                                                                    marginRight: '10px',
                                                                    cursor: 'pointer'
                                                                }} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.changeElemCount(elem.id, -1)
                                                                }}>-
                                                                </div>
                                                                <div
                                                                    onClick={e => e.stopPropagation()}
                                                                    style={{
                                                                        width: '50px',
                                                                        backgroundColor: 'white',
                                                                        border: '1px solid gray',
                                                                        borderRadius: '7px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        padding: '5px',
                                                                        height: '20px'
                                                                    }}>
                                                                    <input disabled={true} style={{
                                                                        background: 'none',
                                                                        outline: 'none',
                                                                        border: 'none',
                                                                        width: '100%'
                                                                    }}
                                                                      value={this.getItemCount(elem)}
                                                                      type={'text'}/></div>
                                                                <div style={{
                                                                    padding: '5px 10px',
                                                                    backgroundColor: 'cornflowerblue',
                                                                    color: 'white',
                                                                    borderRadius: '5px',
                                                                    marginLeft: '10px',
                                                                    cursor: 'pointer'
                                                                }}
                                                                     onClick={(e) => {
                                                                         e.stopPropagation();
                                                                         this.changeElemCount(elem.id, 1)
                                                                     }}>+
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            paddingTop: '40px'
                                                        }}>
                                                            <div className={'basket-delete-button'}
                                                                 onClick={e => {
                                                                     e.stopPropagation();
                                                                     this.removeFromBasket(elem.id);
                                                                 }} style={{
                                                                backgroundColor: 'red',
                                                                padding: '10px 10px',
                                                                borderRadius: '5px',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                cursor: 'pointer',
                                                            }}>
                                                                <img src={trashIcon}
                                                                     style={{
                                                                         width: '22px',
                                                                         height: '22px'
                                                                     }}/>
                                                                <div style={{
                                                                    lineHeight: '25px',
                                                                    paddingLeft: '10px'
                                                                }}>Удалить <span className={'desktop'}>из корзины</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div></div>
                                                </div>
                                                <div className={'basket-element-price-wrapper'}>
                                                <div className={'basket-element-price'}>
                                                    <div>
                                                    <b>Цена:</b> {elem.price ?
                                                    elem.price + " руб."
                                                    : "не указана"}
                                                    </div>
                                                    <div>
                                                        <b>Количество: </b> {this.getItemCount(elem)}
                                                    </div>
                                                    <div>
                                                        <b>Сумма: </b> {elem.price ?
                                                        elem.price * this.getItemCount(elem) + " руб."
                                                        : "не указана"}
                                                    </div>
                                                </div>
                                                </div>
                                            </InfoSection>
                                        })}
                                    </div>
                                    <div className={'bottom-basket-sum'} style={{
                                        textAlign: 'right',
                                        paddingRight: '22px'
                                    }}>
                                        <b>Итоговая сумма <span className={'desktop'}>по всем наименованиям</span>: </b>{totalSum} руб.
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        color: 'cornflowerblue',
                                        fontSize: '1.2em',
                                        padding: '12px 50px'
                                    }}>
                                <span
                                    onClick={this.state.previous ? () => {
                                        this.loadData(null, this.state.previous.replace('http://', 'https://'))
                                    } : null}
                                    style={{
                                        fontSize: '2em',
                                        transform: 'scaleX(0.6)',
                                        cursor: 'pointer'
                                    }}>{'<'}</span>
                                        <span>
                                    {this.state.next ? parseInt(this.state.next.split('=')[1]) - 1
                                        : Math.ceil(this.state.count / 50)}
                                            /
                                            {Math.ceil(this.state.count / 50)}
                                </span>
                                        <span
                                            onClick={this.state.next ? () => {
                                                this.loadData(null, this.state.next.replace('http://', 'https://'))
                                            } : null}
                                            style={{
                                                fontSize: '2em',
                                                transform: 'scaleX(0.6)',
                                                cursor: 'pointer'
                                            }}>{'>'}
                                </span>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </View> :
                <View current={'basket'} showEpicBar={false} headerAnimation={true} title={<div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        fontSize: 'inherit',
                        font: 'inherit',
                        fontWeight: 'inherit'
                    }}>
                    <div onClick={() => this.setCurrentId(null)} style={{paddingLeft: '12px'}}>
                        <img src={backArrow} style={{
                            width: '28px',
                            height: '28px'
                        }}/>
                    </div>
                    <span>Товар</span>
                    <div style={{width: '40px'}}/>
                </div>}>
                    <CurrentProduct id={this.state.currentId}
                                    selectedItems={this.props.selectedItems}
                                    changeSelectedItems={this.props.changeSelectedItems}
                                    setCurrentId={this.setCurrentId}/>
                </View>
        )
    }
}