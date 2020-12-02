import React from 'react';
import data from './data.js';

class App extends React.Component {
  state = {
    serving: '',
    ingredientName: '',
    ingredientAmount: '',
    original: {},
    result: {},
  };

  componentDidUpdate() {
    console.log(this.state);
  }

  recalculateIngredients = (
    body,
    serving = '',
    ingredientName = '',
    ingredientAmount = ''
  ) => {
    let multiplier = 1;
    if (serving !== '') {
      multiplier = serving / body.servings;
    } else if (ingredientName !== '' && ingredientAmount !== '') {
      const base = (() => {
        let base = 0;
        body.ingredients.some((ingr) => {
          if (ingr.name === ingredientName) {
            base = Number(ingr.amount);
            return true;
          } else {
            return false;
          }
        });
        return base;
      })();
      multiplier = ingredientAmount / base;
    }
    const result = {};
    result.title = body.title;
    result.servings = Math.floor(body.servings * multiplier)
      ? Math.floor(body.servings * multiplier)
      : serving === ''
      ? 1
      : 0;
    result.ingredients = [];
    body.ingredients.forEach((ingredient, id) => {
      let temp = { ...ingredient };
      if (ingredient.unit === 'piece') {
        temp.amount = Math.ceil(ingredient.amount * multiplier);
      } else {
        temp.amount = Math.round(ingredient.amount * multiplier * 100) / 100;
      }
      result.ingredients.push(temp);
    });
    this.setState({ result, original: body });
    return;
  };

  render() {
    return (
      <div className="App" style={{ padding: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '170px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              Modify serving
            </div>
            <input
              style={{
                border: '1px solid gray',
                borderRadius: '5px',
                width: '100%',
              }}
              value={this.state.serving}
              type="number"
              min="1"
              max="1000"
              onChange={(e) => {
                this.setState({
                  serving: e.target.value,
                  ingredientName: '',
                  ingredientAmount: '',
                });
              }}
            ></input>
          </div>
          <div
            style={{
              width: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            OR
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '170px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              Modify ingredient
            </div>
            <select
              style={{
                border: '1px solid gray',
                borderRadius: '5px',
                width: '100%',
              }}
              onChange={(e) => {
                this.setState({
                  serving: '',
                  ingredientName: e.target.value,
                });
              }}
              value={this.state.ingredientName}
            >
              <option value="" disabled selected>
                Select ingredient
              </option>
              {data.ingredients.map((ing, id) => {
                return <option value={ing.name}>{ing.name}</option>;
              })}
            </select>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              To amount
            </div>
            <input
              style={{
                border: '1px solid gray',
                borderRadius: '5px',
                width: '100%',
              }}
              type="number"
              min="1"
              max="1000"
              onChange={(e) => {
                this.setState({
                  serving: '',
                  ingredientAmount: e.target.value,
                });
              }}
              value={this.state.ingredientAmount}
            ></input>
          </div>
        </div>
        <button
          onClick={() =>
            this.recalculateIngredients(
              data,
              this.state.serving,
              this.state.ingredientName,
              this.state.ingredientAmount
            )
          }
        >
          Recalculate ingredients
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            marginTop: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ color: 'gray' }}>Original</div>
            <pre style={{ fontWeight: 'normal', color: 'gray' }}>
              {JSON.stringify(this.state.original, null, 2)}
            </pre>
          </div>
          <div style={{ flex: 1 }}>
            <div>Generated</div>
            <pre>{JSON.stringify(this.state.result, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
