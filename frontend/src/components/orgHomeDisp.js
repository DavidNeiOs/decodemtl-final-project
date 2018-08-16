import React, { Component } from 'react';
import { Card, Icon, Image,Grid, Button,Header } from 'semantic-ui-react'
import { connect } from 'react-redux'

class OrgHomeItemDisp extends Component {
    constructor() {
        super();
        this.state = {toAuction:[], auctioned:[]}
    }
    filterItemsByOrgId = () => {
        let itemsFiltred = this.props.items.filter(item => item.state === "TO_AUCTION" && item.orgId === this.props.currOrg);
        let itemsAuctioned = this.props.items.filter(item => item.state === "AUCTIONED" && item.orgId === this.props.currOrg)
        this.setState({ toAuction: itemsFiltred, auctioned: itemsAuctioned });  
    }
    formatItems = (x) => {
        if (x === 1) {
            let firstList = this.state.toAuction
            let filteredList = firstList.map((i) => {
                return (
                    
                    <Card>
                        <Image src={i.images[0]} />
                        <Card.Content>
                        <Card.Header>{i.title}</Card.Header>
                        <Card.Meta>Bid Ends: {i.bidFinDate}</Card.Meta>
                        <Card.Description>{i.description}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='dollar sign' />
                            {i.lastPrice}
                        </Card.Content>
                        <Card.Content extra>
                            <Button fluid> Bid NOW! </Button>
                        </Card.Content>
                    </Card>
                    
                )
            })
            let rItems = [];
            for (let i = 0; i < 4; i++) {
                let index = Math.floor(Math.random() * filteredList.length);
                rItems.push(<Grid.Column>{filteredList[index]}</Grid.Column>);
            }
            return rItems;
        } else if (x===2) {
            let firstList = this.state.auctioned
            let filteredList = firstList.map((i) => {
                return (
                    
                    <Card>
                        <Image src={i.images[0]} />
                        <Card.Content>
                        <Card.Header>{i.title}</Card.Header>
                        <Card.Meta>Bid Ends: {i.bidFinDate}</Card.Meta>
                        <Card.Description>{i.description}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='dollar sign' />
                            {i.lastPrice}
                        </Card.Content>
                        <Card.Content extra>
                            <Button fluid> Bid NOW! </Button>
                        </Card.Content>
                    </Card>
                    
                )
            })
            let rItems = [];
            for (let i = 0; i < 4; i++) {
                let index = Math.floor(Math.random() * filteredList.length);
                rItems.push(<Grid.Column>{filteredList[index]}</Grid.Column>);
            }
            return rItems;
        }
       
    }
    render() {
        {this.filterItemsByOrgId}
        return(
        <div>
          <div>
          
          <br/>
          <Header as='h2' icon='stopwatch' content='Products Currently in Auction' />
          <br/>
          <br/>
          </div>
          
            <div>
                <Grid relaxed='very' columns={4}>
                {this.formatItems(1)}
                </Grid>
            </div>
          
          <br/>
          <br/>
          <div>
          
          <br/>
          <Header as='h2' icon='legal' content='Sold Products' />
          <br/>
          <br/>
          </div>
          
            <div>
                <Grid relaxed='very' columns={4}>
                {this.formatItems(2)}
                </Grid>
            </div>
          
          <br/>
          <br/>

        </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items,
        currOrg : state.orgId
    }
}
export default connect(mapStateToProps)(OrgHomeItemDisp);