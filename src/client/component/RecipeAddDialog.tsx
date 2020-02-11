import React, {
  ChangeEvent,
  FC,
  useMemo,
  useState,
} from 'react';
import {
  AppBar,
  Backdrop,
  Button, CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent, IconButton,
  makeStyles,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { commonTheme } from '@client/App';
import RecipeIngredientsField, { Ingredient } from '@client/component/RecipeIngredientsField';
import RecipeHowToField, { Step } from '@client/component/RecipeHowToField';
import ImageChooseButton from '@client/component/ImageChooseButton';
import { useMutation } from '@apollo/react-hooks';

import { AddRecipeMutation as AddRecipeMutationData, AddRecipeMutationVariables } from '@common/GQLTypes';
import AddRecipeMutation from '@queries/recipeAddDialog_addRecipe.gql';
import { common } from '@material-ui/core/colors';

interface RecipeAddDialogProps {
  open?: boolean;
  onClose?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  clearIcon: {
    color: theme.palette.primary.contrastText,
  },
  imageHolder: {
    background: 'rgba(0, 0, 0, 0)',
    width: 280,
    height: 487,
  },
  imageHolderWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridRow: '1 / 5',
  },
  content: {
    ...commonTheme.appbar(theme, 'paddingTop'),
    marginTop: theme.spacing(1),
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    gridTemplateRows: '64px 64px 64px auto auto 100px',
    [theme.breakpoints.down(650)]: {
      gridTemplateColumns: 'auto',
      gridTemplateRows: 'auto 64px 64px 64px 64px',
    },
  },
  counterText: {
    '& > p': {
      textAlign: 'end',
    },
  },
  textAreaField: {
    margin: theme.spacing(0, 1),
  },
  fullWidth: {
    gridColumn: '1 / 3',
    [theme.breakpoints.down(650)]: {
      gridColumn: '1',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: common.white,
  },
}));

const RecipeAddDialog: FC<RecipeAddDialogProps> = (props: RecipeAddDialogProps) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
  } = props;

  const [recipeInfo, _setRecipeInfo] = useState({
    image: undefined,
    name: '',
    nameHiragana: '',
    description: '',
    howMany: '',
    trick: '',
    background: '',
  });
  const setRecipeInfo = React.useCallback((
    key: keyof typeof recipeInfo,
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    _setRecipeInfo({
      ...recipeInfo,
      [key]: event.target.value,
    });
  }, [recipeInfo]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  const recipe = useMemo(() => ({
    ...recipeInfo,
    ingredients: ingredients.map((i) => {
      const b = { ...i };
      delete b.id;
      b.groupName = (b.groupName ?? '').length > 0 ? b.groupName : undefined;
      return b;
    }),
    steps: steps.map((step, index) => {
      const b = { ...step, step: index + 1 };
      delete b.id;
      return b;
    }),
  }), [recipeInfo, ingredients, steps]);

  const [doAddRecipe, {
    loading,
  }] = useMutation<AddRecipeMutationData, AddRecipeMutationVariables>(AddRecipeMutation, {
    variables: { recipe },
    onCompleted({ addRecipe }) {
      if (addRecipe.success) onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Backdrop className={classes.backdrop} open={loading} timeout={-1}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Add Recipe
          </Typography>
          <IconButton onClick={onClose} className={classes.clearIcon}>
            <Clear />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <div className={classes.imageHolderWrapper}>
          <ImageChooseButton
            image={recipeInfo.image}
            onChange={(image) => _setRecipeInfo({ ...recipeInfo, image })}
            classes={{ root: classes.imageHolder }}
            subText="(resize 280x487)"
            accept="image/jpeg"
          />
        </div>
        <TextField
          label="Recipe Name"
          classes={{ root: classes.counterText }}
          helperText={`${recipeInfo.name.length}/20`}
          value={recipeInfo.name}
          onChange={(event) => setRecipeInfo('name', event)}
        />
        <TextField
          label="Recipe Name(Hiragana)"
          classes={{ root: classes.counterText }}
          helperText={`${recipeInfo.nameHiragana.length}/60`}
          value={recipeInfo.nameHiragana}
          onChange={(event) => setRecipeInfo('nameHiragana', event)}
        />
        <TextField
          label="Description"
          classes={{ root: classes.counterText }}
          helperText={`${recipeInfo.description.length}/60`}
          value={recipeInfo.description}
          onChange={(event) => setRecipeInfo('description', event)}
          multiline
          rowsMax={4}
        />
        <RecipeIngredientsField
          value={ingredients}
          onChange={setIngredients}
          howMany={recipeInfo.howMany}
          changeHowMany={(s) => _setRecipeInfo({ ...recipeInfo, howMany: s })}
        />
        <RecipeHowToField
          steps={steps}
          onChange={setSteps}
          className={classes.fullWidth}
        />
        <TextField
          multiline
          rowsMax={4}
          label="Trick"
          classes={{ root: classes.counterText }}
          className={classes.textAreaField}
          helperText={`${recipeInfo.trick.length}/120`}
          value={recipeInfo.trick}
          onChange={(event) => setRecipeInfo('trick', event)}
        />
        <TextField
          multiline
          rowsMax={4}
          label="Background of this recipe"
          classes={{ root: classes.counterText }}
          className={classes.textAreaField}
          helperText={`${recipeInfo.background.length}/120`}
          value={recipeInfo.background}
          onChange={(event) => setRecipeInfo('background', event)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => doAddRecipe()}>
          Add Recipe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeAddDialog;
