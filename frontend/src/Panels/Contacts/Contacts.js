import * as React from "react";
import View from "../../Components/View/View";
import InfoSection from "../../Components/InfoSection/InfoSection";
import './Contacts.css'

const AnyReactComponent = ({ text }) => <div>{text}</div>;
export default class Contacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPointerEvents: true
        }
    }

    setPointerEvents = (isPointerEvents) => {
        this.setState({
            isPointerEvents: isPointerEvents
        })
    }

    render() {
        return (
            <View current={'contacts'} title={'Контакты'} setPointerEvents={this.setPointerEvents}>
                <InfoSection>
                    Тут какие-то контакты
                </InfoSection>
                <InfoSection>
                        <div className={'mobile-iframe'} style={{width: '100%', }}>
                                <iframe width="100%" height="600"

                                        src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=H64X%2B37%20%D0%A1%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BE%2C%20%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB.+()&amp;ie=UTF8&amp;t=&amp;z=18&amp;iwloc=B&amp;output=embed"
                                        frameBorder="0" scrolling="no" marginHeight="0"
                                        marginWidth="0"></iframe>
                        </div>
                </InfoSection>
            </View>
        )
    }
}