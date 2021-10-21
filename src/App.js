import React, { Component } from "react";
import EscribirEnLaBlockchainContract from "./contracts/EscribirEnLaBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";
 
class App extends Component {
  state = { 
    web3: null, 
    accounts: null, 
    contract: null,
    valorActual: 'Cargando...',
    nuevoValor: ''
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EscribirEnLaBlockchainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EscribirEnLaBlockchainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

        const response = await this.state.contract.methods.Lee().call();
        console.log(response);
        this.setState({
          valorActual : response
        })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  StoreValue = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;
    try{
      // Envía el nuevo valor
      await contract.methods.Escribri(this.state.nuevoValor).send({ from: accounts[0] });

      const response = await this.state.contract.methods.Lee().call();
      
      this.setState({
        valorActual : response
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error
      );
      console.error(error);
    }
  };

  handleChangeValue = (event) => {
    this.setState({
        nuevoValor : event.target.value
      })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Primera App Smart Contract</h1>
        <label>El valor actual es: { this.state.valorActual }</label>
        <br />
        <form onSubmit={this.StoreValue}>
          <label>
            El nuevo valor es: 
          </label>
          <br />
          <input type="text" value={this.state.nuevoValor} onChange={this.handleChangeValue}></input>
          <br/>
          <input type="submit" value="Enviar a la Blockchain"></input>
        </form>
      </div>
    );
  }
}

export default App;
