import * as React from "react";
import InfoSection from "../../Components/InfoSection/InfoSection";

export default class ErrorPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <InfoSection>
                    Ошибка 404
                </InfoSection>
            </div>
        )
    }
}