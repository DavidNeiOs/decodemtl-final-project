import React, { Component } from 'react';
import { Card, Icon, Image,Grid, Button, Modal, Header, Form, Label, Input } from 'semantic-ui-react'
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
            i.images = ['stefan-ivanov-83176.jpg']
            return (
                <Card>
                    <Image src={'./images/' + i.images[0]} />
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
                        <Modal trigger={<Button>Bid Now</Button>} closeIcon>
                                <Modal.Header>{i.title}</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='medium' src={'./images/' + i.images[0]}/>
                                    <Modal.Description>
                                        <Header>Item ID : {i.itemId}</Header>
                                        <p>{i.description}</p>
                                        <h2>{i.bidFinDate}</h2>
                                        <Form>
                                        <Form.Field inline>
                                            <label>Amount:</label>
                                                <Label as='a' basic>$</Label>
                                                <Input 
                                                    type='number' 
                                                    name='initialPrice' 
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                        </Form.Field>
                                        <Button fluid> Bid NOW! </Button>
                                        </Form>
                                        
                                    </Modal.Description>
                                </Modal.Content>
                        </Modal>
                        </Card.Content>
                </Card>
                
            )
        })
        let rItems = [];
        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * filteredList.length);
            rItems.push(<Grid.Column>{filteredList[index]}</Grid.Column>);
        }
        return rItems;
    }
    componentDidMount() {
        this.getItems();
    }
    render() {
        return(
            <div>
                <Grid relaxed='very' columns={5}>
                {this.formatItems()}
                </Grid>
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