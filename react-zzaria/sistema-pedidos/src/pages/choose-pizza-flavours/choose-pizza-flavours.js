import React from 'react'
import t from 'prop-types'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import {
  Card,
  Grid,
  Typography
} from '@material-ui/core'
import {
  CardLink,
  Divider,
  H4,
  HeaderContent,
  PizzasGrid
} from 'ui'
import { singularOrPlural } from 'utils'
import { HOME } from 'routes'

import pizzaFlavours from 'fake-data/pizzas-flavours.js'

const ChoosePizzaFlavours = ({ location }) => {
  if (!location.state) {
    return <Redirect to={HOME} />
  }
  const { flavours, id } = location.state

  return (
    <>
      <HeaderContent>
        <H4>
          Choose up to {flavours} {' '}
          {singularOrPlural(flavours, 'flavor', 'flavours')}:
        </H4>
      </HeaderContent>

      <PizzasGrid>
        {pizzaFlavours.map((pizza) => (
          <Grid item key={pizza.id} xs>
            <Card>
              <Label>
                <Img src={pizza.image} alt={pizza.name} />

                <Divider />

                <Typography>
                  {pizza.name}
                </Typography>

                <Typography variant='h5'>
                  {pizza.value[id]}
                </Typography>
              </Label>
            </Card>
          </Grid>
        ))}
      </PizzasGrid>
    </>
  )
}

ChoosePizzaFlavours.propTypes = {
  location: t.object.isRequired
}

const Label = styled(CardLink).attrs({
  component: 'label'
})``

const Img = styled.img`
  width: 200px;
`

export default ChoosePizzaFlavours
