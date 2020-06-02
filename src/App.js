import React, {Component} from 'react';
import {Tabs, Button, Input, Layout, message, Steps, Tag, Upload,Form} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';

import EmailModal from './emailModal';
import Dashboard from "./dashboard";

import "antd/dist/antd.css";
import './App.css';
import {TweenOneGroup} from "rc-tween-one";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;


const props = {
    name: 'file',
    action: `http://139.59.39.11:9999/data/aman`,
};

const forMap = tag => {
    const tagElem = (
        <Tag
            closable
            onClose={e => {
                e.preventDefault();
                this.handleClose(tag);
            }}
        >
            {tag}
        </Tag>
    );
    return (
        <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
};

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

function callback(key) {
    console.log(key);
}


export default class App extends Component{
    state = {
        visible: false,
        numberOfEmail: ['modal'],
        tags: ['first_name','last_name','email'],
        inputVisible: false,
        inputValue: '',
        current: 0,
        campaignName : ``,
        contactList : '',
        email: [],
        isLoggedIn : false,
        uuid : ``,
        accessToken: ``,
        refreshToken: ``,
        id:``,
        defaultTab : 1,
        isDisabled: false,
    };

    componentDidMount() {

        const accessToken  = localStorage.getItem('accessToken') || undefined;
        console.log(accessToken, 'component did mount')
        if(accessToken){
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                accessToken: accessToken,
            });
        //
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
        //
            fetch(`http://139.59.39.11:9999/verify`, requestOptions)
                .then(response => {
                    console.log(response,"RESPONSE");
                    if(response.status > 300){
                        throw new Error(response.message);
                    }
                    response.text()
                })
                .then(result => {
                    console.log(result);
                    message.success(`Process completed`);
                    this.setState({isLoggedIn: true})
                })
                .catch(error => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('uuid');
                    localStorage.removeItem('id');
                    console.log('error', error)
                    message.error(`Process incomplete. Please try again.`)
                });
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('uuid');
            localStorage.removeItem('id');
        }
    }

    addModal = e => {
        let number = this.state.numberOfEmail;
       number.push('modal');
       console.log(number, "NUMBER");
        this.setState({
            numberOfEmail: number,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk =(index) =>e => {
        console.log(e);
        let subject = document.getElementById(index+"subject");
        let html = document.getElementById(index+"html");
        let plain = document.getElementById(index+"plain");
        let time = document.getElementById(index+"datetime");

        let data = {
            "subject": subject.value,
            "html_content":html.value,
            "plain_content": plain.value,
            "time":time.value,
            "generate_plain_content": true,
            "sender_id": 853416,
        };
        let email = this.state.email;
        console.log(email,"EMAIL");
        email.push(data);

        this.setState({
            visible: false,
            email
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => (this.input = input);


    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    changeState = (key) =>(event) => {
        this.setState({[key]:event.target.value});
    };


    onChangeUpload = (info) =>{

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            this.setState({contactList: info.file.name});
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    onClickDone = (state) => (event) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            data: state,
            accessToken: localStorage.getItem('accessToken'),
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        console.log(this.state, "THIS STATE")
        let id = this.state.id || localStorage.getItem('id')
        fetch(`http://139.59.39.11:9999/create-campaign/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                message.success(`Process completed`);
                this.setState({defaultTab: 1,isDisabled:true});
            })
            .catch(error => {
                console.log('error', error)
                message.error(`Process incomplete. Please try again.`)
            });
    };

    logout = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            uuid: this.state.uuid,
            accessToken: localStorage.getItem('accessToken'),
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://139.59.39.11:9999/user/logout", requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({
                    visible: false,
                    numberOfEmail: ['modal'],
                    tags: ['first_name','last_name','email'],
                    inputVisible: false,
                    inputValue: '',
                    current: 0,
                    campaignName : ``,
                    contactList : '',
                    email: [],
                    isLoggedIn : false,
                    uuid : ``,
                    accessToken: ``,
                    refreshToken: ``,
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('uuid');
                localStorage.removeItem('id');
                return message.success(`Logged out`);
            })
            .catch(error => {
                console.log('error', error);
                message.error(`Process incomplete. Please try again.`)
            });

    };

    render () {
        const { current, numberOfEmail,tags } = this.state;
        const tagChild = tags.map(forMap);

        console.log(this.state,"STATE");

        const onFinish = values => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "email":values.email,
                "password":values.password
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://139.59.39.11:9999/user/login", requestOptions)
                .then(response => {
                    console.log(response,"RESPONSE");
                    if(response.status > 300){
                        throw new Error(response.message);
                    }
                    return response.text();
                })
                .then(result => {
                    result = JSON.parse(result);
                    // console.log(result.accessToken,"RESULT accessToken")
                    // console.log(result.refreshToken,"RESULT refreshToken")
                    // console.log(result.uuid,"RESULT uuid")
                    const {uuid,accessToken,refreshToken,id} = result;
                    console.log(uuid, "UUID")
                    console.log(accessToken, "accessToken");
                    console.log(refreshToken, "refreshToken");

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('uuid', uuid);
                    localStorage.setItem('id', id);

                    this.setState({isLoggedIn: true, uuid, accessToken, refreshToken, id});
                })
                .catch(error => {
                    message.error("please try again");
                    console.log('error', error)
                });

            console.log('Success:', values);
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const steps = [
            {
                title: 'Campaign Name',
                content: <Content style={{"width": "90%",  margin:"10px auto"}}>
                            <Input
                                placeholder="Campaign Name"
                                style = {{
                                    "margin" : "10px",
                                }}
                                required={true}
                                id={"campaign_name"}
                                value={this.state.campaignName}
                                onChange={this.changeState("campaignName")}
                            />
                </Content>,
            },{
              title:  `Custom fields`,
                content:<div style={{padding: "10px",marginBottom:"10px"}}>
                    <div style={{ marginBottom: 16 }}>
                        <label>{`Please add the custom fields in your csv file`}</label>
                        <TweenOneGroup
                            enter={{
                                scale: 0.8,
                                opacity: 0,
                                type: 'from',
                                duration: 100,
                                onComplete: e => {
                                    e.target.style = '';
                                },
                            }}
                            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                            appear={false}
                        >
                            {tagChild}
                        </TweenOneGroup>
                    </div>
                    {this.state.inputVisible && (
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={this.inputValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                    )}
                    {!this.state.inputVisible && (
                        <Tag onClick={this.showInput} className="site-tag-plus">
                            <PlusOutlined /> New Tag
                        </Tag>
                    )}
                </div>
            },
            {
                title: 'Email format and timing',
                content: <Content style={{width: "90%",  margin:"0 auto"}}>
                            {
                                numberOfEmail.map((item, index) => {
                                    return (
                                        <EmailModal
                                            key = {index}
                                            visible={this.state.visible}
                                            showModal = {this.showModal}
                                            handleOk = {this.handleOk}
                                            handleCancel = {this.handleCancel}
                                            tags = {this.state.tags}
                                            inputVisible={this.state.inputVisible}
                                            inputValue = {this.state.inputValue}
                                            showInput = {this.showInput}
                                            handleInputChange = {this.handleInputChange}
                                            handleInputConfirm = {this.handleInputConfirm}
                                            saveInputRef = {this.saveInputRef}
                                            forMap = {this.forMap}
                                            index = {index}
                                        />
                                    )
                                })
                            }

                        <div
                            onClick={this.addModal}
                            style= {{
                                "backgroundColor": "rgb(250, 250, 250)",
                                "width":"fit-content",
                                "paddingLeft":"10px",
                                "cursor":"pointer"
                            }}
                        >
                        <label style={{
                            "cursor":"pointer"
                        }}
                        >
                            {`Add more templates`}</label>
                            <PlusOutlined
                                style = {{
                                    "padding": "0",
                                    "margin": "10px",
                                    "display": "inline-block",
                                    "width": "30px",
                                    "height": "auto",
                                }}
                            />
                        </div>
                </Content>,
            },
            {
                title: 'Upload contact list for the campaign. Delimiter is ",".',
                content: <Content style={{width: "90%",  margin:"0 auto"}}>
                        <Upload {...props} onChange= {this.onChangeUpload}>
                            <Button>
                                <UploadOutlined /> Click to Upload Contact list
                            </Button>
                        </Upload>
                </Content>,
            },
        ];
        const operations = <Button onClick={this.logout}>Logout</Button>;
        return (
            !this.state.isLoggedIn ?
                <Layout style={{width: "70%", margin:"10px auto"}}>
                    <Header style={{background:"#fafafa"}}><h4>{`Email Marketing Campaign`}</h4></Header>
                    <Content style={{"width": "90%",  margin:"10px auto"}}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                    </Content>
                    <Footer style={{background:"#fafafa"}}>Email marketing app copyright@2020</Footer>
                </Layout>
             :
                <Tabs
                    defaultActiveKey={this.state.defaultTab}
                    onChange={callback}
                    style={{width:"70%", margin:"10px auto"}}
                    tabBarExtraContent={operations}
                >
                    <TabPane tab="Insights" key="1">
                        <Dashboard/>
                    </TabPane>
                    <TabPane tab="Email Campaign" key="2">
                        <Layout style={{
                            width: "100%",
                            margin:"10px auto"
                        }}>
                            <Header style={{background:"#fafafa", textAlign: "center"}}><h4>{`Email Marketing Campaign`}</h4></Header>
                            <div style={{
                                fontSize: "14px"
                            }}>
                                <Steps current={current}>
                                    {steps.map(item => (
                                        <Step
                                            key={item.title}
                                            title={item.title}
                                            style={{
                                                "margin":"10px"
                                            }}
                                        />
                                    ))}
                                </Steps>
                                <div className="steps-content">{steps[current].content}</div>
                                <div className="steps-action">
                                    {current < steps.length - 1 && (
                                        <Button
                                            type="primary"
                                            onClick={() => this.next()}
                                            style={{
                                                "margin":"10px"
                                            }}
                                        >
                                            Next
                                        </Button>
                                    )}
                                    {current === steps.length - 1 && (
                                        <Button
                                            type="primary"
                                            onClick={this.onClickDone(this.state)}
                                            style={{
                                                "margin":"10px"
                                            }}
                                            disabled={this.state.isDisabled}
                                        >
                                            Done
                                        </Button>
                                    )}
                                    {current > 0 && (
                                        <Button
                                            style = {{
                                                margin: '10px 18px'
                                            }}
                                            onClick={() => this.prev()}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <Footer style={{background:"#fafafa"}}>Email marketing app copyright@2020</Footer>
                        </Layout>
                    </TabPane>
                </Tabs>

        )
    }
}
