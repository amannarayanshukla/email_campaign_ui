import React from "react";
import {Button, Modal, Input,DatePicker} from "antd";
import moment from 'moment';

const { TextArea } = Input;


function EmailModal(props) {
    return (
        <div style = {{
            "marginBottom" : "10px"
        }}>
            <Button type="primary" onClick={props.showModal}>
                Open EmailModal
            </Button>
            <Modal
                title="Basic EmailModal"
                visible={props.visible}
                onOk={props.handleOk(props.index)}
                onCancel={props.handleCancel}
            >
                <label>{`Please submit before existing`}</label>
                <Input placeholder={`example subject`} id={props.index+"subject"}/>
                <TextArea placeholder={`<tag>example html</tag>`} id={props.index+"html"}/>
                <TextArea placeholder={`example plain`} id={props.index+"plain"}/>
                <DatePicker
                    id={props.index+"datetime"}
                    disabledDate={(d) => d && d < moment().startOf('day')}
                    showToday={false}
                    showTime
                    defaultValue = {moment(new Date(),'HH:mm:ss').add('10','minutes')}
                />
            </Modal>
        </div>
    )
}

export default EmailModal;
