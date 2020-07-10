import * as React from "react";
import ProductItem from "../ProductItem/ProductItem";
import './ProductShop.css'
import noImage from "../../icons/not-found.png";
import settings from '../../settings'
import Spinner from "../Spinner/Spinner";
import {Link} from "react-router-dom";
import CurrentProduct from "../../Panels/CurrentProduct/CurrentProduct";

export default class ProductShop extends React.Component {
    constructor(props) {
        super(props);
        const tempArray = []
        for (let i = 0; i < 30; i++) {
            tempArray.push(i)
        }
        this.state = {
            width: 0,
            height: 0,
            array: [],
            tempArray: tempArray,
            itemWidth: 160
        }
        this.productListRef = React.createRef();
        this.productItemRef = React.createRef();
    }

    updateDimensions = () => {
        this.setState({width: window.innerWidth, height: window.innerHeight});
        this.alignData()
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        window.addEventListener('focus', this.alignData);
        window.addEventListener('mouseover', this.alignData);
        window.addEventListener('mouseout', this.alignData);

        this.alignData()
    }

    alignData = () => {
        if (this.productListRef.current && this.productItemRef.current) {
            const tempArray = []
            const itemsCount = Math.floor(this.productListRef.current.offsetWidth / this.productItemRef.current.offsetWidth)
            if (itemsCount > 0)
                for (let i = 0; i < itemsCount - this.props.items.length % itemsCount; i++) {
                    tempArray.push(i)
                }

            this.setState({
                tempArray: tempArray,
                itemWidth: this.productItemRef.current.offsetWidth
            })
        } else {
            const tempArray = []
            for (let i = 0; i < 30; i++) {
                tempArray.push(i)
            }
            this.setState({
                tempArray: tempArray,
                itemWidth: 130
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.data !== this.state.data) {
            this.alignData()
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
        window.removeEventListener('focus', this.alignData);
        window.removeEventListener('mouseover', this.alignData);
        window.removeEventListener('mouseout', this.alignData);
    }

    render() {
        return (
            <div style={{
                marginTop: '40px',
                flexGrow: '1',
                paddingRight: '10px',
                paddingLeft: '20px',
            }}>
                <div style={{}}>
                    {this.props.loading ? <div style={{}}><Spinner/></div> : <>
                        <div className={'view-horizontal-title'}
                             style={{marginBottom: '15px'}}>Товары
                        </div>

                        <div className={'product-shop-list'} ref={this.productListRef}>
                            {this.props.items.length > 0 ?
                                this.props.items.map((elem, index) => {
                                    return <div style={{marginBottom: '15px',}}
                                                ref={this.productItemRef}
                                                onClick={() => this.props.setCurrentId(elem.id)}>

                                        <ProductItem
                                            currentId={elem.id}
                                            selectedItems={this.props.selectedItems}
                                            changeSelectedItems={this.props.changeSelectedItems}
                                            imageUrl={elem.photo ? elem.photo : noImage}>
                                            <div>Цена: {elem.price ? elem.price + " руб." : "не указана"}</div>
                                            <div>{elem.name}</div>
                                        </ProductItem>
                                    </div>
                                }) : <div style={{width: '100%', textAlign: 'center', paddingTop: '100px'}}>
                                    Ни одного товара не найдено
                                </div>
                            }
                            {
                                this.state.tempArray.map((elem, index) => {
                                    return <div style={{width: this.state.itemWidth}}></div>
                                })
                            }
                        </div>
                        {this.props.items.length > 0 ? this.props.children : null}
                    </>
                    }
                </div>
            </div>
        )
    }
}