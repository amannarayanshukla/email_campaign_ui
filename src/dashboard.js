import React, {Component} from "react";


export default class Dashboard extends Component{
    state = {
        results : []
    }

    componentDidMount() {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": localStorage.getItem("id"),
            "accessToken": localStorage.getItem("accessToken")
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://139.59.39.11:9999/user/dashboard", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log("COMPONENT DID MOUNT123")
                console.log(JSON.parse(result), "RESULT FOR DASHBOARD")
                this.setState({results : result})
            })
            .catch(error => console.log('error', error));
    }

    render() {
        return (
            <div style = {{
                "marginBottom" : "10px"
            }}>
                {
                    this.state.results && this.state.results.length !== 0 &&  JSON.parse(this.state.results).data && JSON.parse(this.state.results).data.length !== 0?
                        <div>
                            {JSON.parse(this.state.results).data.map(result => {
                                let keys = Object.keys(result.results[0].stats);
                                let values = Object.values(result.results[0].stats);
                                return keys.map((item,index) => {
                                    return <div>
                                        <span><strong>CAMPAIGN ID :</strong> {result.results[0].id }</span><br/>
                                        <span><strong>KEY :</strong> {item}</span> <span><strong>VALUE :</strong> {values[index]}</span> </div>
                                })
                            })}
                        </div>
                        :
                        <div>
                            {`no data`}
                        </div>
                }
            </div>
        )
    }
}
