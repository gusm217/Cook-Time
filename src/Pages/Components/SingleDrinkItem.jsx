import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { manageDetailAPI } from '../../Helpers/convertUrlToID';
import CarrouselFoods from './CarrouselFoods';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import '../../styles/singleFood.css';

function SingleFoodItem() {
  const { id } = useParams();
  const currentStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const history = useHistory();
  const [itemDetail, setItemDetail] = useState({ drinks: null });
  const arrayOfIngredients = [];
  const arrayOfMeasures = [];

  useEffect(() => {
    const FetchDrink = async () => {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      const detailRequest = await response.json();
      setItemDetail(manageDetailAPI(detailRequest));
    };
    FetchDrink();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (itemDetail.meals) return null;
  // Parte que separa os ingredientes da receitas
  if (itemDetail.drinks !== null) {
    const drink = itemDetail.drinks[0];
    console.log(drink);

    const arrayOfIngredientsKey = Object
      .keys(drink).filter((key) => key.includes('strIngredient'));
    const arrayOfMeasuresKey = Object
      .keys(drink).filter((key) => key.includes('strMeasure'));
    arrayOfIngredientsKey.map((ingredient) => {
      if (drink[ingredient] !== ''
      && drink[ingredient] !== ' '
      && drink[ingredient] !== null) {
        arrayOfIngredients.push(drink[ingredient]);
      }
      return null;
    });
    arrayOfMeasuresKey.map((ingredient) => {
      if (drink[ingredient] !== ''
      && drink[ingredient] !== ' '
      && drink[ingredient] !== null) {
        arrayOfMeasures.push(drink[ingredient]);
      }
      return null;
    });
  }
  const { drinks } = itemDetail;

  return itemDetail.drinks !== null && (
    <div className="d-flex flex-column container pb-4">
      <h1 className="align-self-center" data-testid="recipe-title">{drinks[0].strDrink}</h1>
      <img
        width="100%"
        src={ drinks[0].strDrinkThumb }
        alt={ `Foto da bebida chamada ${drinks[0].strDrink}` }
        data-testid="recipe-photo"
      />
      <div>
        <FavoriteButton currentItem={ drinks[0] } typeOf="Drink" />
        <ShareButton />
      </div>
      <div className="row px-3">
        <p style={ { fontWeight: 'bold' } } data-testid="recipe-category">{drinks[0].strAlcoholic}</p>
        <p>{' - '}</p>
        <p style={ { fontWeight: 'bold' } } data-testid="recipe-category">{drinks[0].strCategory}</p>
      </div>
      <section>
        <h2>Ingredientes</h2>
        <table>
          { arrayOfIngredients.map((ingred, i) => (
            <tr key={ `${ingred}-${i}` }>
              <th data-testid={ `${i}-ingredient-name-and-measure` }>
                {`${arrayOfIngredients[i]} ${arrayOfMeasures[i]
                  ? ` - ${arrayOfMeasures[i]}` : ''} `}
              </th>
            </tr>
          ))}
        </table>
      </section>
      <section>
        <h2>Instruções</h2>
        <p data-testid="instructions">{drinks[0].strInstructions}</p>
      </section>
      <CarrouselFoods />
      <button
        data-testid="start-recipe-btn"
        type="button"
        className="align-self-center start-recipe-button"
        onClick={ () => history
          .push(`/bebidas/${id}/in-progress`) }
      >
        { currentStorage
        && currentStorage.cocktails[id] ? 'Continuar Receita' : 'Iniciar Receita'}
      </button>
    </div>
  );
}

export default SingleFoodItem;
