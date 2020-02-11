import React, { FC } from 'react';
import {
  Card, CardActionArea,
  CardContent,
  createStyles,
  Typography,
} from '@material-ui/core';
import { Recipe } from '@common/GQLTypes';
import { makeStyles } from '@material-ui/core/styles';

type RecipeCardProps = Pick<Recipe, 'id' | 'name' | 'description' | 'image'> & {
  classes?: { media: string };
  onClick?: () => void;
};

const useStyles = makeStyles(() => createStyles({
  card: {
    height: 'fit-content',
  },
  media: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
  },
}));

const RecipeCard: FC<RecipeCardProps> = (props: RecipeCardProps) => {
  const classes = useStyles(props);
  const {
    id,
    name,
    description,
    image,
    onClick,
  } = props;

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea onClick={onClick}>
        {(image) && (
          <img
            className={classes.media}
            src={`recipe/${id}.jpg`}
            alt="recipe"
          />
        )}
        <CardContent>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;
