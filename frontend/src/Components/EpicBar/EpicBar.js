import * as React from "react";
import {Link} from "react-router-dom";
import mainIcon from '../../icons/main.svg'
import productsIcon from '../../icons/products.svg'
import basketIcon from '../../icons/basket.svg'
import contactsIcon from '../../icons/contacts.svg'
import './EpicBar.css'

export default class EpicBar extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {current} = this.props;
        return (
            <div className={'view-epicbar'} onMouseOut={this.props.onMouseOut} onMouseOver={this.props.onMouseOver}>
                <Link to={'/'} className={'current'}><img className={current === 'main' && 'current'} src={mainIcon}/></Link>
                <Link to={'/products/'}><img className={current === 'products' && 'current'} src={productsIcon}/></Link>
                <Link to={'/basket/'}><img className={current === 'basket' && 'current'} src={basketIcon}/></Link>
                <Link to={'/contacts/'}><img className={current === 'contacts' && 'current'} src={contactsIcon}/></Link>
            </div>
        )
    }
}