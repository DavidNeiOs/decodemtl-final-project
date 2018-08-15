import React, { Component } from 'react';
import { Card, Icon, Image,Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'

class HomeItemDisp extends Component {
    constructor() {
        super();
        this.state = {items:[],randomItems:[]}
        this.getItems = this.getItems.bind(this)
    }
    getItems() {
        fetch('/getItems')
          .then(response => response.text())
          .then(responseBody => {
            let parsedBody = JSON.parse(responseBody);
            let itemList = parsedBody.items;
            this.props.dispatch({
                type: 'getItems',
                content: itemList
            })

            let itemsFiltred = this.props.items.filter(item => item.state === "TO_AUCTION");
            this.setState({ items:itemList, randomItems: itemsFiltred });     
          })        
    }
    formatItems = () => {
        let firstList = this.state.randomItems
        let filteredList = firstList.map((i) => {
            return (
                <div>
                <Grid.Column>
                <Card>
                    <Image src={i.images[0]} />
                    <Card.Content>
                    <Card.Header>{i.title}</Card.Header>
                    <Card.Meta>Bid Ends: {i.bidFinDate}</Card.Meta>
                    <Card.Description>{i.description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='user' />
                        {i.lastPrice}
                    </Card.Content>
                </Card>
                </Grid.Column>
                </div>
            )
        })
        return filteredList;
    }
    componentDidMount() {
        this.getItems();
    }
    render() {
        return(
            <div>
                {this.formatItems()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items
    }
}
export default connect(mapStateToProps)(HomeItemDisp);