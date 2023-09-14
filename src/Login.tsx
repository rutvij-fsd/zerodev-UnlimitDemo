import { createStyles, Title, Text, Container, Flex, Button } from '@mantine/core';
import { ReactComponent as ZeroDevLogo } from './resources/assets/images/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Passkey from './Passkey';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
    },
  },

  highlight: {
    color: 'rgb(201, 247, 58)',
  },
}));

export function Login() {
  const { classes } = useStyles();

  return (
    <Container h={'100vh'}>
    <Flex justify={"center"} align={"center"} mih={'100%'} direction={'column'} gap={30}>
      <ZeroDevLogo width={200} height={'auto'} style={{ marginBottom: '20px', position:'relative', left: '4rem', top: '2rem' }} /> {/* Adjusted width and added margin */}
      <Title className={classes.title} style={{ textAlign: 'center' }}> {/* Centered text */}
        Supercharge Web3 UX with<br />
        <Text component="span" className={classes.highlight} inherit>
          Account Abstraction
        </Text>
      </Title>
      <div>
      <ConnectButton label={"Start Demo"} /> {/* Added margin for spacing */}
      </div>
      <p style={{ textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}> {/* Centered and limited width for better readability */}
        Unleash the Power of Account Abstraction
      </p>
    </Flex>
    </Container>
  );
}