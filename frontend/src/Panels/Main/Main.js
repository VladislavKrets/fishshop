import * as React from "react";
import View from "../../Components/View/View";
import InfoSection from "../../Components/InfoSection/InfoSection";
import HorizontalScroll from "../../Components/HorizontalScroll/HorizontalScroll";
import ProductItem from "../../Components/ProductItem/ProductItem";
import background from '../../images/fish-background.jpeg'
import NavBar from "../../Components/NavBar/NavBar";
import {Link} from "react-router-dom";
import logo from '../../images/logo.png'
import Spinner from "../../Components/Spinner/Spinner";
import noImage from "../../icons/not-found.png";
import axios from '../../api'
import backArrow from "../../icons/back-arrow.svg";
import CurrentProduct from "../CurrentProduct/CurrentProduct";

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bestsellers: [],
            promotions: [],
            bestsellersLoading: true,
            promotionsLoading: true,
            isNavMouseOver: false,
            currentId: null
        }
    }

    componentDidMount() {
        axios.get('/items/bestsellers/').then(data => {
            this.setState({
                bestsellersLoading: false,
                bestsellers: data.data
            })
        })
        axios.get('/items/promotions/').then(data => {
            this.setState({
                promotionsLoading: false,
                promotions: data.data
            })
        })
    }

    setCurrentId = (id) => {
        if (id !== null){
            window.history.pushState({}, 'product', `/products/${id}/`)
        }
        this.setState({
            currentId: id
        })
    }

    render() {
        return (
            !this.state.currentId ?
            <View current={'main'} title={'Главная'}>
                <div style={{
                    backgroundImage: `url(${background})`,
                    boxSizing: 'border-box',
                    backgroundClip: 'border-box',
                    paddingBottom: '40px',
                    backgroundSize: 'cover'
                }}>
                    <div style={{height: '53px'}}></div>
                    <NavBar current={'main'} style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 1,
                        /*{
                        opacity: this.state.isNavMouseOver ? null : 0.7,
                        transition: 'background-color 0.5s',
                        backgroundColor: this.state.isNavMouseOver ? null : 'transparent'
                    }*/
                    }}
                            onMouseOut={() => this.setState({isNavMouseOver: false})}
                            onMouseOver={() => this.setState({isNavMouseOver: true})}/>
                    <div className={'desktop'} style={{
                        backgroundColor: 'cornflowerblue',
                    }}>
                        <div style={{

                            display: "flex",
                            margin: '0 auto',
                            width: '60%',
                            padding: '20px 0',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <img src={logo} style={{width: '150px', height: '150px'}}/>
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '1.5em',
                                    fontWeight: '700',
                                    fontFamily: '\'Balsamiq Sans\', cursive, \'Arial\'',
                                    color: 'white'
                                }}>Все для рыбалки
                                </div>
                                <div style={{color: 'white'}}>Магазин товаров для рыбалки</div>
                            </div>
                            <div style={{color: 'white'}}>
                                <div>+7(000)000-00-00</div>
                                <div>Лен.область, Приозерский район</div>
                                <div>п.Сосново, Ул Ленинградская 9б</div>
                            </div>
                        </div>
                    </div>
                    <div className={'mobile'} style={{
                        backgroundColor: 'cornflowerblue',
                        padding: '0 5px',
                        paddingBottom: '20px'
                    }}>
                        <div style={{

                            display: "flex",
                            padding: '20px 0',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <img src={logo} style={{width: '150px', height: '150px'}}/>
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '1.5em',
                                    fontWeight: '700',
                                    fontFamily: '\'Balsamiq Sans\', cursive, \'Arial\'',
                                    color: 'white'
                                }}>Все для рыбалки
                                </div>
                                <div style={{color: 'white'}}>Магазин товаров для рыбалки</div>
                            </div>
                        </div>
                        <div>
                            <div style={{color: 'white', textAlign: 'center'}}>
                                <div>+7(000)000-00-00</div>
                                <div>Лен.область, Приозерский район</div>
                                <div>п.Сосново, Ул Ленинградская 9б</div>
                            </div>
                        </div>
                    </div>
                    <InfoSection style={{
                        opacity: 0.7,
                        color: 'blue',
                        fontWeight: 800,
                        borderRadius: '12px'
                    }}>
                        <div>
                            <p>
                                Говорить о нашем сайте, как о просто "Магазине рыболовных снастей",
                                было бы неправильно. В нашем магазине "Все для рыбалки"
                                рыболовные снасти представлены в широчайшем
                                ассортименте. Однако, мы не останавливаемся только на продаже
                                снастей, рыболовный интернет магазин и розничная сеть постоянно
                                развиваются, ищут новые рыболовные товары, которые смогут занять
                                почетное место среди Ваших снастей для рыбалки.
                            </p>
                        </div>
                    </InfoSection>
                    <InfoSection style={{
                        opacity: 0.7,
                        color: 'blue',
                        fontWeight: 800,
                        borderRadius: '12px'
                    }}>
                        <div>
                            <p>
                                Наш рыболовный интернет магазин готов стать для Вас прекрасным
                                помощником во всех Ваших рыболовных начинаниях. Рыболовные и
                                туристические товары из нашего каталога смогут удовлетворить и
                                начинающего любителя спиннинга и бывалого специалиста нахлыста.
                            </p>
                        </div>
                    </InfoSection>
                    <HorizontalScroll title={'Товары недели'} id={'container1'}
                                      style={{opacity: 0.8, borderRadius: '12px'}}>
                        {
                            this.state.bestsellersLoading ?
                                <Spinner style={{marginTop: '10px', width: '100%'}}/> :
                                this.state.bestsellers.length === 0 ? <div style={{
                                        height: '180px',
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                    Товары не найдены
                                    </div> :
                                    this.state.bestsellers.map((elem, index) => {
                                        return <div onClick={() => this.setCurrentId(elem.id)}><ProductItem
                                            currentId={elem.id}
                                            selectedItems={this.props.selectedItems}
                                            changeSelectedItems={this.props.changeSelectedItems}
                                            imageUrl={elem.photo ? elem.photo : noImage}>
                                            <div>Цена: {elem.price ? elem.price + " руб." : "не указана"}</div>
                                            <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{elem.name}</div>
                                        </ProductItem></div>
                                    })
                        }
                    </HorizontalScroll>
                    <InfoSection style={{
                        opacity: 0.7,
                        color: 'blue',
                        fontWeight: 800,
                        borderRadius: '12px'
                    }}>
                        <div>
                            <p>
                                Снасти для рыбалки в нашем каталоге только высочайшего качества:
                                удилища, спиннинги, катушки, воблеры, блесны, лески, шнуры,
                                экипировка, а также множество товаров для нахлыста.
                            </p>
                        </div>
                    </InfoSection>
                    <InfoSection style={{
                        opacity: 0.7,
                        color: 'blue',
                        fontWeight: 800,
                        borderRadius: '12px'
                    }}>
                        <div>
                            <p>
                                Мы представляем товары для рыбалки только проверенных временем
                                компаний, таких как: Shimano, Daiwa, Abu Garcia, Ryobi, Rapala,
                                Jackall, Smith, Owner, Zipbaits и многих других, чьё потрясающее
                                качество угодит даже самым дотошным любителям рыбалки.
                            </p>
                        </div>
                    </InfoSection>
                    <HorizontalScroll title={'Акции'} id={'container2'}
                                      style={{opacity: 0.8, borderRadius: '12px'}}>
                        {
                            this.state.promotionsLoading ?
                                <Spinner style={{marginTop: '10px', width: '100%'}}/> :
                                this.state.promotions.length === 0 ? <div style={{
                                        height: '180px',
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        Товары не найдены
                                    </div> :
                                this.state.promotions.map((elem, index) => {
                                    return <div onClick={() => this.setCurrentId(elem.id)}><ProductItem
                                        currentId={elem.id}
                                        selectedItems={this.props.selectedItems}
                                        changeSelectedItems={this.props.changeSelectedItems}
                                        imageUrl={elem.photo ? elem.photo : noImage}>
                                        <div>Цена: {elem.price ? elem.price + " руб." : "не указана"}</div>
                                        <div style={{overflow: 'hidden', textOverflow: 'ellipsis',}}>{elem.name}</div>
                                    </ProductItem></div>
                                })
                        }
                    </HorizontalScroll>
                    <InfoSection style={{
                        opacity: 0.7,
                        color: 'blue',
                        fontWeight: 800,
                        borderRadius: '12px'
                    }}>
                        <div style={{textAlign: 'center'}}>
                            <p style={{paddingBottom: '20px'}}>Как с нами связаться и где нас
                                найти?</p>
                            <p>
                                <Link to={'/contacts/'} style={{
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    padding: '15px',
                                    background: 'blue',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}>Контакты</Link>
                            </p>
                        </div>
                    </InfoSection>
                </div>
            </View> : <View current={'products'} showEpicBar={false} headerAnimation={true} title={<div
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
                    <CurrentProduct id={this.state.currentId} selectedItems={this.props.selectedItems}
                                    changeSelectedItems={this.props.changeSelectedItems} setCurrentId={this.setCurrentId}/>
                </View>
        )
    }
}