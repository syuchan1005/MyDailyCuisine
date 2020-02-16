import React, { FC } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle, List, ListItem, ListItemAvatar, ListItemText,
} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';

import { RecipesQuery as RecipesQueryData, RecipesQueryVariables } from '@common/GQLTypes.ts';
import RecipesQuery from '@queries/common/recipes.gql';

interface RecipeSelectDialogProps {
  open?: boolean,
  onClose?: () => void;
  onChange?: (recipe) => void;
}

// const useStyles = makeStyles(() => createStyles({}));

const RecipeSelectDialog: FC<RecipeSelectDialogProps> = (props: RecipeSelectDialogProps) => {
  // const classes = useStyles(props);
  const {
    open,
    onClose,
    onChange,
  } = props;

  const {
    data,
    // refetch,
  } = useQuery<RecipesQueryData, RecipesQueryVariables>(RecipesQuery);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Recipe</DialogTitle>

      <List>
        {(data?.recipes ?? []).map((recipe) => (
          <ListItem
            key={recipe.id}
            button
            onClick={() => {
              if (onChange) onChange(recipe);
              if (onClose) onClose();
            }}
          >
            <ListItemAvatar>
              <Avatar alt={recipe.name} src={recipe.image ? `/recipe/${recipe.id}_40x40^c.jpg` : undefined}>
                {recipe.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={recipe.name}
              secondary={recipe.description}
            />
          </ListItem>
        ))}
      </List>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeSelectDialog;
