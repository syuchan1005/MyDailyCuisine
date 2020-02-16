import React, {
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  makeStyles,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Search } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks';

import RecipeSelectDialog from '@client/component/RecipeSelectDialog';
import {
  Recipe,
  AddMealMutation as AddMealMutationData,
  AddMealMutationVariables,
} from '@common/GQLTypes';

import AddMealMutation from '@queries/mealAddDialog_addMeal.gql';

interface MealAddDialogProps {
  open?: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles(() => createStyles({
  counterText: {
    '& > p': {
      textAlign: 'end',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const MealAddDialog: FC<MealAddDialogProps> = (props: MealAddDialogProps) => {
  const classes = useStyles(props);
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    if (open) setTime(new Date());
  }, [open]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [openSelectRecipe, setOpenSelectRecipe] = useState(false);
  const [recipe, setRecipe] = useState<Pick<Recipe, 'id' | 'name'>>(undefined);

  const [doAddMeal, {
    loading,
  }] = useMutation<AddMealMutationData, AddMealMutationVariables>(AddMealMutation, {
    variables: {
      meal: {
        time,
        name,
        description,
        recipeId: recipe?.id,
      },
    },
    onCompleted(data) {
      if (data.addMeal.success) {
        if (onClose) onClose();
        if (onAdded) onAdded();
      }
    },
  });

  const clickClose = useCallback(() => {
    if (loading) return;
    if (onClose) onClose();
    setName('');
    setDescription('');
    setRecipe(undefined);
  }, [onClose, loading]);

  return (
    <Dialog open={open} onClose={clickClose}>
      <DialogTitle>Add Meals</DialogTitle>

      <DialogContent className={classes.content}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            value={time}
            onChange={setTime}
            ampm={false}
            label="Time"
            format="yyyy/MM/dd HH:mm"
          />
        </MuiPickersUtilsProvider>
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          classes={{ root: classes.counterText }}
          helperText={`${name.length}/120`}
        />
        <TextField
          label="Description"
          multiline
          rowsMax={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          classes={{ root: classes.counterText }}
          helperText={`${description.length}/120`}
        />
        <FormControl>
          <InputLabel>Recipe</InputLabel>
          <Input
            value={recipe?.name ?? ''}
            readOnly
            endAdornment={(
              <InputAdornment position="end">
                <IconButton onClick={() => setOpenSelectRecipe(true)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            )}
          />
        </FormControl>
        <RecipeSelectDialog
          open={openSelectRecipe}
          onClose={() => setOpenSelectRecipe(false)}
          onChange={setRecipe}
        />
      </DialogContent>

      <DialogActions>
        <Button
          disabled={loading}
          onClick={clickClose}
        >
          Close
        </Button>
        <Button
          disabled={loading}
          onClick={() => doAddMeal()}
        >
          Add Meal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealAddDialog;
