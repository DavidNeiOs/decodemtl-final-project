import React, { Component } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'


class OrgCard extends Component {
    constructor() {
        super();
    }


    handleSettings = () => {
        this.props.dispatch({
            type: 'showOrgProfile',
            content: true
        })
    }

    render() {
            if (this.props.liveOrg[0] !== undefined) {return (
                <div>
            <Card>
                <Image src={'/images/'+this.props.liveOrg[0].logo}/>
                <Card.Content>
                <Card.Header>{this.props.liveOrg[0].orgName}</Card.Header>
                <Card.Meta><a href={this.props.liveOrg[0].website}>{this.props.liveOrg[0].website}</a></Card.Meta>
                <Card.Description>
                    Email : {this.props.liveOrg[0].email}
                    <br/>
                    <div>
                        <Button circular color='facebook' icon='facebook' />
                        <Button circular color='twitter' icon='twitter' />
                        <Button circular color='linkedin' icon='linkedin' />
                        <Button circular color='google plus' icon='google plus' />
                    </div>
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button onClick={this.handleSettings}>Edit Profile</Button>
                </Card.Content>
            </Card>
          </div>
            )} else {
                return (
                    <div></div>
                )
            }
    }
}
function mapStateToProps(state) {
    return {
        items: state.items,
        currOrg : state.orgId,
        liveOrg: state.currentOrg,
    }
}
export default connect(mapStateToProps)(OrgCard);

