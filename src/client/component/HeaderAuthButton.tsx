import React, {
  FC,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { Button, useMediaQuery, useTheme } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import SignDialog from '@client/component/SignDialog';
import authModule, { getAuth } from '@client/store/modules/authModule';

type HeaderAuthButtonProps = {
  children?: ReactNode;
};

const HeaderAuthButton: FC = (props: HeaderAuthButtonProps) => {
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);

  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));

  const [openSignDialog, setOpenSignDialog] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const openSignDialogFn = useCallback((up) => {
    setSignUp(up);
    setOpenSignDialog(true);
  }, []);

  const clickSignOut = useCallback(() => {
    dispatch(authModule.actions.reset());
  }, [dispatch]);

  if (auth.accessToken) {
    return (
      <>
        {props.children}
        <Button
          size={upSm ? 'medium' : 'small'}
          onClick={clickSignOut}
        >
          Sign out
        </Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => openSignDialogFn(false)}>
        Sign in
      </Button>
      <Button variant="outlined" onClick={() => openSignDialogFn(true)}>
        Sign up
      </Button>

      <SignDialog
        open={openSignDialog}
        signUp={signUp}
        onClose={() => setOpenSignDialog(false)}
      />
    </>
  );
};

export default HeaderAuthButton;
