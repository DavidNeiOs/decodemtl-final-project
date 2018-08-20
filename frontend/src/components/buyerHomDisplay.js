import React, { Component } from 'react'
import { Grid, Menu, Card, Button, Modal, Header, Image, Icon, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Chat from './Chat.js'

class BuyerHomeDisplay extends Component {

    constructor() {
        super();
        this.state = {
            activeItem: '',
            orgNames: []
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    formatItems = (name) => {
        if (name === '') {
            let filteredList = this.props.myItems.filter(item => item.state === 'TO_AUCTION').map((i) => {
                    return (
                        <Card>
                            <Image src={'/images/' + i.images} />
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
                                <Modal size={'large'} trigger={<Button fluid> SEE DETAILS </Button>} closeIcon>
                                    <Modal.Header>{i.title}</Modal.Header>
                                    <Modal.Content image scrolling>
                                        <Image wrapped size='medium' src={'/images/' + i.images} />
                                        <Modal.Description>
                                            <Header>Item ID : {i.itemId}</Header>
                                            <h3>Category : {i.category}</h3>
                                            <p>{i.description}</p>
                                            <h2>{i.bidFinDate}</h2>
                                            <Button.Group>
                                                <Button onClick={() => this.handleEditClick(i)}>Edit</Button>
                                                <Button>Close Auction</Button>
                                                <Button onClick={() => this.handleCancelClick(i)}>Cancel Auction</Button>
                                            </Button.Group>
                                        </Modal.Description>
                                        <Modal.Description>
                                            <Chat itemId={i.itemId} org={this.props.org} />
                                        </Modal.Description>
        
                                    </Modal.Content>
                                </Modal>
                            </Card.Content>
                        </Card>
                    )
            })
            let rItems = [];
            for (let i = 0; i < this.props.myItems.length; i++) {
                rItems.push(<Grid.Column> {filteredList[i]}</Grid.Column>);
            }
            console.log(this.props.myprotemsItems);
            return this.state.activeItem ? rItems.filter(item => item.category === this.state.activeItem) : rItems;
    
        } else {
            let category = this.state.activeItem;
            let filteredList = this.props.myItems.filter( item => 
                (item.state === 'TO_AUCTION' && item.category === category) ||
                    (item.state === 'TO_AUCTION' && item.orgId === category)).map((i) => {
                
                    return (
    
                        <Card>
                            <Image src={'/images/' + i.images} />
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
                                <Modal size={'large'} trigger={<Button fluid> SEE DETAILS </Button>} closeIcon>
                                    <Modal.Header>{i.title}</Modal.Header>
                                    <Modal.Content image scrolling>
                                        <Image wrapped size='medium' src={'/images/' + i.images} />
                                        <Modal.Description>
                                            <Header>Item ID : {i.itemId}</Header>
                                            <h3>Category : {i.category}</h3>
                                            <p>{i.description}</p>
                                            <h2>{i.bidFinDate}</h2>
                                            <Button.Group>
                                                <Button onClick={() => this.handleEditClick(i)}>Edit</Button>
                                                <Button>Close Auction</Button>
                                                <Button onClick={() => this.handleCancelClick(i)}>Cancel Auction</Button>
                                            </Button.Group>
                                        </Modal.Description>
                                        <Modal.Description>
                                            <Chat itemId={i.itemId} org={this.props.org} />
                                        </Modal.Description>
        
                                    </Modal.Content>
                                </Modal>
                            </Card.Content>
                        </Card>
        
                    )
            })
            let rItems = [];
            for (let i = 0; i < this.props.myItems.length  ; i++) {
                rItems.push(<Grid.Column> {filteredList[i]}</Grid.Column>);
            }
            return rItems;
        }
    }

    getOrgNames = () => {
        fetch('/getOrgs')
            .then(response => response.text())
            .then(responseBody => {
                let body = JSON.parse(responseBody);
                let names = body.orgs.map(org => {
                    return {
                        orgName: org.orgName,
                        orgId: org.orgId
                    }
                })
                this.setState({ orgNames: names})
            })
    }
    handleOrgClicks = (id) => {

    }
    componentDidMount () {
        this.getOrgNames();
    }

    render() {
        
        return (
            <Grid>
                <Grid.Column width={2}>
                    <Menu fluid vertical tabular>
                        <Menu.Item
                            name='Electronics'
                            active={this.state.activeItem === 'Electronics'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Furniture'
                            active={this.state.activeItem === 'Furniture'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Clothing'
                            active={this.state.activeItem === 'Clothing'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Handmade'
                            active={this.state.activeItem === 'Handmade'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Sport'
                            active={this.state.activeItem === 'Sport'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Other'
                            active={this.state.activeItem === 'Other'}
                            onClick={this.handleItemClick}
                        />
                        <Divider />
                        <Header as='h4' style={{paddingLeft: '15px'}}> Non-Porifts</Header>
                        {this.state.orgNames.map(oName => {
                            return <Menu.Item
                                name={oName.orgName}
                                active={this.state.activeItem === oName.orgName}
                                onClick={this.handleItemClick}
                            />
                        })}
                    </Menu>
                    
                </Grid.Column>

                <Grid.Column stretched width={12}>
                    <Grid columns={4}>
                        {this.formatItems(this.state.activeItem)}
                    </Grid>
                </Grid.Column>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        myItems: state.items
    }
}
export default connect(mapStateToProps)(BuyerHomeDisplay);