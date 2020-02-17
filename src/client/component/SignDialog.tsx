import React, {
  FC,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import {
  Backdrop,
  Button, CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Divider,
  TextField, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { common } from '@material-ui/core/colors';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import {
  SignUpMutation as SignUpMutationData,
  SignUpMutationVariables,
  SignInMutation as SignInMutationData,
  SignInMutationVariables,
} from '@common/GQLTypes';
import SignUpMutation from '@queries/signDialog_signUp.gql';
import SignInMutation from '@queries/signDialog_signIn.gql';
import authModule from '@client/store/modules/authModule';

interface SignDialogProps {
  open?: boolean;
  signUp?: boolean;
  onClose?: () => void;
  onChange?: (signUp: boolean) => void;
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  backdrop: {
    color: common.white,
    zIndex: theme.zIndex.modal + 1,
  },
}));

const SignDialog: FC<SignDialogProps> = (props: SignDialogProps) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const {
    open,
    signUp,
    onClose,
    onChange,
    children,
  } = props;

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const closeFn = useCallback(() => {
    if (onClose) onClose();
    setName('');
    setPassword('');
  }, [onClose]);

  const onCompleted = useCallback((payload) => {
    const data = payload.signIn || payload.signUp;
    if (data.success) {
      closeFn();
      dispatch(authModule.actions.set(data.token));
    }
  }, [closeFn, dispatch]);

  const [doSignUp, {
    loading: signUpLoading,
  }] = useMutation<SignUpMutationData, SignUpMutationVariables>(SignUpMutation, {
    variables: { name, password },
    onCompleted,
  });

  const [doSignIn, {
    loading: signInLoading,
  }] = useMutation<SignInMutationData, SignInMutationVariables>(SignInMutation, {
    variables: { name, password },
    onCompleted,
  });

  return (
    <Dialog open={open} onClose={closeFn}>
      <Backdrop
        className={classes.backdrop}
        open={signUpLoading || signInLoading}
        timeout={-1}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
      <DialogTitle>{signUp ? 'Sign up' : 'Sign in'}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="username"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          type="password"
          label="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFn}>
          Close
        </Button>
        <Button onClick={() => (signUp ? doSignUp() : doSignIn())}>
          {signUp ? 'Sign up' : 'Sign in'}
        </Button>
      </DialogActions>
      {(onChange) && (
        <DialogContent>
          <Divider />
          {(signUp) ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body1" component="div">Already Have?</Typography>
              <Button onClick={() => onChange(false)}>
                Sign in
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body1" component="div">New to Here?</Typography>
              <Button onClick={() => onChange(true)}>
                Create an account
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SignDialog;
