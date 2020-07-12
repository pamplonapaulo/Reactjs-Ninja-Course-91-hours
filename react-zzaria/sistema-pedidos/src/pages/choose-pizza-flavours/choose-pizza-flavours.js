import React, { useState } from 'react'
import t from 'prop-types'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import {
  Card as MaterialCard,
  Grid,
  Typography
} from '@material-ui/core'
import {
  CardLink,
  Content,
  Divider,
  Footer,
  H4,
  HeaderContent,
  PizzasGrid
} from 'ui'
import { singularOrPlural, toMoney } from 'utils'
import { HOME, CHOOSE_PIZZA_AMOUNT } from 'routes'

import pizzaFlavours from 'fake-data/pizzas-flavours.js'

const ChoosePizzaFlavours = ({ location }) => {
  const [checkboxes, setCheckboxes] = useState(() => ({}))

  if (!location.state) {
    return <Redirect to={HOME} />
  }
  const { flavours, id } = location.state.pizzaSize

  const handleChangeCheckbox = (pizzaId) => (e) => {
    if (
      checkboxesChecked(checkboxes).length === flavours &&
      e.target.checked === true
    ) {
      return
    }

    setCheckboxes((checkboxes) => {
      return {
        ...checkboxes,
        [pizzaId]: e.target.checked
      }
    })
  }

  return (
    <>
      <Content>
        <HeaderContent>
          <H4>
            Choose up to {flavours} {' '}
            {singularOrPlural(flavours, 'flavor', 'flavours')}:
          </H4>
        </HeaderContent>

        <PizzasGrid>
          {pizzaFlavours.map((pizza) => (
            <Grid item key={pizza.id} xs>
              <Card checked={!!checkboxes[pizza.id]}>
                <Label>
                  <Checkbox
                    value=''
                    checked={!!checkboxes[pizza.id]}
                    onChange={handleChangeCheckbox(pizza.id)}
                  />

                  <Img src={pizza.image} alt={pizza.name} />

                  <Divider />

                  <Typography>
                    {pizza.name}
                  </Typography>

                  <Typography variant='h5'>
                    {toMoney(pizza.value[id])}
                  </Typography>
                </Label>
              </Card>
            </Grid>
          ))}
        </PizzasGrid>
      </Content>

      <Footer
        buttons={{
          back: {
            children: 'Change size'
          },

          action: {
            to: {
              pathname: CHOOSE_PIZZA_AMOUNT,
              state: {
                ...location.state,
                pizzaFlavours: getFlavoursNameAndId(checkboxes)
              }
            },
            children: 'How many?',
            disabled: checkboxesChecked(checkboxes).length === 0
          }
        }}
      />
    </>
  )
}

ChoosePizzaFlavours.propTypes = {
  location: t.object.isRequired
}

function checkboxesChecked (checkboxes) {
  return Object.values(checkboxes).filter(Boolean)
}

function getFlavoursNameAndId (checkboxes) {
  return Object.entries(checkboxes)
    .filter(([_, value]) => !!value)
    .map(([id]) => ({
      id,
      name: pizzaFlavours.find((flavour) => flavour.id === id).name
    }))
}

const Card = styled(MaterialCard)`
  border: 2px solid transparent;
  border-color: ${({ theme, checked }) => checked ? theme.palette.secondary.light : ''};
`

const Checkbox = styled.input.attrs({
  type: 'checkbox'
})`
  display: none;
`

const Label = styled(CardLink).attrs({
  component: 'label'
})``

const Img = styled.img`
  width: 200px;
`

export default ChoosePizzaFlavours
