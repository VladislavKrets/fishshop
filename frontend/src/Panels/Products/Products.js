import * as React from "react";
import View from "../../Components/View/View";
import LeftTopicBar from "../../Components/LeftTopicBar/LeftTopicBar";
import Search from "../../Components/Search/Search";
import LeftTopicBarItem from "../../Components/LeftTopicBarItem/LeftTopicBarItem";
import ProductShop from "../../Components/ProductShop/ProductShop";
import searchSettings from '../../icons/search_settings.svg'
import MobileSearchTopic from "../../Components/MobileSearchTopic/MobileSearchTopic";
import addIcon from '../../icons/add_icon.svg'
import axios from '../../api'
import Spinner from "../../Components/Spinner/Spinner";
import CurrentProduct from "../CurrentProduct/CurrentProduct";
import backArrow from '../../icons/back-arrow.svg'

export default class Products extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topics: [],
            isMobileSearchDisplayed: false,
            mobileSearch: null,
            historyProd: [],
            loading: true,
            shopLoading: false,
            selectedTopics: [],
            items: [],
            next: null,
            previous: null,
            count: 0,
            searchProductName: '',
            page: 1,
            currentId: null
        }
    }

    setCurrentId = (id) => {
        if (id !== null){
            window.history.pushState({}, 'product', `/products/${id}/`)
        }
        this.setState({
            currentId: id
        })
    }

    addMobileSearch = (mobileSearch) => {
        const {historyProd} = this.state;
        historyProd.push(mobileSearch);
        this.setState({
            mobileSearch: mobileSearch,
            historyProd: historyProd
        })
    }

    handleSearchChange = (e) => {
        const name = e.target.value;
        this.setState({
            searchProductName: name
        })
        this.sendSearchRequest(name)
    }

    onCloseMobileSearch = () => {
        this.setState({
            mobileSearch: null,
            historyProd: []
        })
    }

    switchMobileTopic = (e) => {
        let {topics, selectedTopics} = this.state;
        this.getMobileTopic(parseInt(e.target.name), topics[0].children, topics[0], false)
        this.setState({
            topics: topics,
        })
        this.sendSearchRequest()
    }

    switchMobileTopicNext = (e) => {
        let {topics, selectedTopics} = this.state;
        selectedTopics.push(e.target.name)
        this.getMobileTopic(parseInt(e.target.name), topics[0].children, topics[0], true)
        this.setState({
            topics: topics,
        })
        this.sendSearchRequest()
    }

    getMobileTopic = (topic_id, topics, prevTopic, next) => {
        if (topic_id === prevTopic.id) {
            prevTopic.checked = !prevTopic.checked
            if (this.state.historyProd.length !== 0)
                this.generateSearchMobile(prevTopic.children, this.state.historyProd.length - 1, prevTopic)
            return;
        }
        for (let i = 0; i < topics.length; i++) {
            if (topics[i].id === topic_id) {
                topics[i].checked = !topics[i].checked
                if (this.state.historyProd.length !== 0)
                    if (!next)
                        this.generateSearchMobile(topics, this.state.historyProd.length - 1, prevTopic)
                    else
                        this.generateSearchMobile(topics[i].children, this.state.historyProd.length - 1, topics[i])
                break;
            } else if (topics[i].children) {
                this.getMobileTopic(topic_id, topics[i].children, topics[i])
            }
        }
    }

    reset = () => {
        const {topics} = this.state;
        this.resetMobileTopic(topics);
        this.setState({
            topics: topics,
            searchProductName: '',
            selectedTopics: []
        })
        if (this.state.historyProd.length !== 0) {
            this.generateSearchMobile(topics[0].children, this.state.historyProd.length - 1, topics[0])
        }
        this.getProducts(null, '')
    }

    resetMobileTopic = (topics) => {
        for (let i = 0; i < topics.length; i++) {
            topics[i].checked = false;
            if (topics[i].children) {
                this.resetMobileTopic(topics[i].children)
            }
        }
    }

    sendSearchRequest = (prodName) => {
        this.getProducts(null, prodName)
    }

    findAllIds = (ids, topics) => {
        topics.forEach((elem, index) => {
            if (elem.checked) {
                ids.push(elem.id);
                if (elem.children) {
                    this.addAllChildrenIds(ids, elem.children)
                }
            } else {
                if (elem.children)
                    this.findAllIds(ids, elem.children)
            }
        })
    }

    addAllChildrenIds = (ids, topics) => {
        topics.forEach((elem, index) => {
            ids.push(elem.id);
            if (elem.children) {
                this.addAllChildrenIds(ids, elem.children)
            }
        })
    }

    generateSearchMobile = (topics, key, prevElem) => {
        const mobileSearch = <MobileSearchTopic
            key={key || key === 0 ? key : this.state.historyProd.length}
            reset={this.reset}
            onClose={this.onCloseMobileSearch}
            goBack={this.historyGoBack}
            isDisplayed={this.state.isMobileSearchDisplayed}>
            {prevElem ? <div style={{padding: '12px 0'}}>
                <label style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}><span style={{paddingRight: '5px'}}>Выбрать всё</span><input
                    name={prevElem.id}
                    checked={!!prevElem.checked}
                    onChange={this.switchMobileTopicNext}
                    style={{transform: 'scale(1.5)', marginRight: '7px'}}
                    type={'checkbox'}/></label>
            </div> : <div></div>}
            {
                topics.map((elem, index) => {
                    return <div style={{padding: '12px 0'}} key={index}
                                onClick={elem.children ? () => {
                                    this.generateSearchMobile(elem.children, null, elem)
                                } : null}>
                        <label style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}><span
                            style={{paddingRight: '5px'}}>{elem.name}</span>
                            {!elem.children ?
                                <input name={elem.id} onChange={this.switchMobileTopic}
                                       checked={!!elem.checked}
                                       style={{transform: 'scale(1.5)', marginRight: '7px'}}
                                       type={'checkbox'}/> :
                                <img src={addIcon} style={{width: '28px', height: '28px'}}/>}
                        </label>
                    </div>
                })
            }
        </MobileSearchTopic>
        if (!key && key !== 0) this.addMobileSearch(mobileSearch)
        else {
            const {historyProd} = this.state;
            historyProd[key] = mobileSearch;
            this.setState({
                mobileSearch: mobileSearch,
                historyProd: historyProd
            })
        }
    }

    historyGoBack = () => {
        const historyProd = this.state.historyProd;
        if (historyProd.length > 1) {
            historyProd.pop();
            this.setState({
                historyProd: historyProd,
                mobileSearch: historyProd[historyProd.length - 1]
            })
        }
    }

    getProducts = (url, prodName) => {
        this.setState({
            shopLoading: true
        })
        let selectedIds = []
        this.findAllIds(selectedIds, this.state.topics)
        let name = this.state.searchProductName;
        if (prodName !== null && prodName !== undefined) name = prodName;
        const data = {}
        if (selectedIds.length > 0) {
            data['topic_id__in'] = selectedIds
        }
        if (name) {
            data['name__icontains'] = name
        }
        axios.post(url ? url : '/items/', data, {
            headers: {},
        }).then(data => {
            const page = !data.data.previous ? 1 :
                !data.data.next ? parseInt(data.data.previous.split('=')[1]) + 1
                    : parseInt(data.data.next.split('=')[1]) - 1
            this.setState({
                items: data.data.results,
                next: data.data.next,
                previous: data.data.previous,
                count: data.data.count,
                shopLoading: false,
                page: page
            })
        })
    }

    componentDidMount() {
        axios.get('/topics/', {
            headers: {}
        }).then(data => {
            this.setState({
                topics: data.data,
                loading: false,
                shopLoading: true,
            })
            this.getProducts();
        })
    }

    render() {
        console.log(this.state.selectedTopics)
        return (
            !this.state.currentId ?
                <View current={'products'} title={'Товары'}>
                    {this.state.loading ? <Spinner/> : <>
                        <div className={'mobile-search-categories'} style={{
                            position: 'fixed',
                            top: '53px',
                            left: '0',
                            width: '100%',
                            boxSizing: 'border-box',
                            borderBottom: '1px solid cornflowerblue',
                            backgroundColor: 'white',
                        }}>
                            <Search placeholder={'Введите название товара'}
                                    value={this.state.searchProductName} style={{height: '40px'}}
                                    onChange={this.handleSearchChange}/>
                            <div style={{padding: '0 5px'}} onClick={() => {
                                this.generateSearchMobile(this.state.topics[0].children, null, this.state.topics[0])
                            }}><img
                                src={searchSettings}
                                style={{width: '28px', height: '28px'}}/>
                            </div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '15px'}}>
                            <LeftTopicBar>
                                <Search placeholder={'Введите название товара'}
                                        value={this.state.searchProductName}
                                        onChange={this.handleSearchChange}/>
                                <div style={{textAlign: 'center', color: 'white', padding: '5px'}}>
                                <span style={{
                                    borderBottom: '1px solid white',
                                    cursor: 'pointer'
                                }} onClick={this.reset}>Сбросить</span>
                                </div>
                                <LeftTopicBarItem switchMobileTopic={this.switchMobileTopic}
                                                  expand={true}
                                                  switchMobileTopicNext={this.switchMobileTopicNext}
                                                  checked={this.state.topics[0].checked}
                                                  items={this.state.topics[0].children}
                                                  marginLeft={0}
                                                  id={this.state.topics[0].id}
                                                  name={this.state.topics[0].name}/>
                            </LeftTopicBar>
                            <ProductShop setCurrentId={this.setCurrentId} items={this.state.items}
                                         loading={this.state.shopLoading} selectedItems={this.props.selectedItems}
                                         changeSelectedItems={this.props.changeSelectedItems}>
                                {this.state.shopLoading ? <div></div> :
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
                                        this.getProducts(this.state.previous.replace('http://', 'https://'))
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
                                                this.getProducts(this.state.next/*.replace('http://', 'https://')*/)
                                            } : null}
                                            style={{
                                                fontSize: '2em',
                                                transform: 'scaleX(0.6)',
                                                cursor: 'pointer'
                                            }}>{'>'}
                                </span>
                                    </div>
                                }
                            </ProductShop>
                        </div>
                        {this.state.mobileSearch}
                    </>}
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