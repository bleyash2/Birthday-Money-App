import "./App.css";
import React from "react";
import { useSpring, animated } from "react-spring";
import LocalAtmTwoToneIcon from "@material-ui/icons/LocalAtmTwoTone";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import MonetizationOnTwoToneIcon from "@material-ui/icons/MonetizationOnTwoTone";
import PrintIcon from "@material-ui/icons/Print";
import CakeIcon from "@material-ui/icons/Cake";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

function App() {
  return (
    <div className="App">
      <MoneyContainer />
    </div>
  );
}

interface Upgrades {
  MoneyPrinter: { qty: number; actives: NodeJS.Timeout[] };
  Mint: { qty: number; actives: NodeJS.Timeout[] };
  Birthday: { qty: number };
}

const getInitalUpgrades = (): Upgrades => {
  return {
    MoneyPrinter: { qty: 0, actives: [] },
    Mint: { qty: 0, actives: [] },
    Birthday: { qty: 0 },
  };
};

function MoneyContainer() {
  const [money, setMoney] = React.useState<JSX.Element[]>([]);
  const [upgradeObject, setUpgrades] = React.useState<Upgrades>(getInitalUpgrades());
  const [birthday, setBirthday] = React.useState(false);
  const containerRef = React.useRef(null);

  function getContainerWidth(): number {
    const element = document.getElementById("moneyContainer");
    if (element !== null) {
      return element.offsetWidth;
    } else return 0;
  }

  const addMoney = () => {
    const Size = Math.floor(Math.random() * 100 + 50);
    const XPos = Math.floor(Math.random() * getContainerWidth() - Size / 2);

    setMoney((currentMoney) => [
      ...currentMoney,
      <AnimatedMoney key={money.length} x={XPos} y={0} height={Size} width={Size} />,
    ]);
  };

  const subtractMoney = (subtractAmount: number) => {
    setMoney((currentMoney) => {
      let newArray = currentMoney;
      newArray.splice(0, subtractAmount);
      return newArray;
    });
  };

  console.log(upgradeObject);

  if (birthday) return <Birthday />;
  return (
    <div ref={containerRef} id="moneyContainer" className="moneyContainer">
      <UpgradesDrawer
        setUpgrades={setUpgrades}
        money={money}
        addMoney={addMoney}
        subtractMoney={subtractMoney}
        setBirthday={setBirthday}
      />
      <div style={{ margin: "1rem", fontSize: "large", fontWeight: "bold" }}>
        Money: {money.length}
      </div>
      <Button onClick={addMoney}>Click Me</Button>
      {money.map((MoneyComp) => MoneyComp)}
    </div>
  );
}

interface UpgradesProps {
  setUpgrades: React.Dispatch<React.SetStateAction<Upgrades>>;
  money: JSX.Element[];
  addMoney: () => void;
  subtractMoney: (subtractAmount: number) => void;
  setBirthday: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpgradesDrawer({
  setUpgrades,
  money,
  addMoney,
  subtractMoney,
  setBirthday,
}: UpgradesProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleMoneyPrinter = () => {
    if (money.length >= 50) {
      subtractMoney(50);
      const interval = setInterval(() => {
        addMoney();
      }, 5000);
      setUpgrades((currentUpgrades) => {
        return {
          ...currentUpgrades,
          MoneyPrinter: {
            qty: currentUpgrades.MoneyPrinter.qty + 1,
            actives: [...currentUpgrades.MoneyPrinter.actives, interval],
          },
        };
      });
    }
  };

  const handleMint = () => {
    if (money.length >= 250) {
      subtractMoney(250);
      const interval = setInterval(() => {
        addMoney();
      }, 1000);
      setUpgrades((currentUpgrades) => {
        return {
          ...currentUpgrades,
          Mint: {
            qty: currentUpgrades.Mint.qty + 1,
            actives: [...currentUpgrades.Mint.actives, interval],
          },
        };
      });
    }
  };

  const handleBirthday = () => {
    if (money.length >= 1) {
      setBirthday(true);
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Upgrades
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Upgrades - ${money.length}</DrawerHeader>
            <DrawerBody>
              <div style={{ display: "flex", flexDirection: "column" }}>
                Money Printer - $50
                <Button onClick={handleMoneyPrinter}>
                  <PrintIcon />
                </Button>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                Mint - $250
                <Button onClick={handleMint}>
                  <AccountBalanceIcon />
                </Button>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                Happy Birthday - $1000
                <Button onClick={handleBirthday}>
                  <CakeIcon />
                </Button>
              </div>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

interface MoneyProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

function AnimatedMoney(props: MoneyProps) {
  const [visible, setVisible] = React.useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 1500);
  });

  const spring = useSpring({
    top: "100%",
    from: { top: "0%" },
    config: { mass: 1, tension: 180, friction: 12 },
  });

  if (!visible) {
    return <React.Fragment />;
  } else
    return (
      <animated.svg
        style={{
          position: "absolute",
          transform: `translateY(-${props.height}px)`,
          left: props.x,
          width: `${props.width}px`,
          height: `${props.height}px`,
          ...spring,
        }}
      >
        {Math.round(Math.random()) ? (
          <LocalAtmTwoToneIcon style={{ color: "green", fill: "green" }} />
        ) : (
          <MonetizationOnTwoToneIcon style={{ color: "gold", fill: "gold" }} />
        )}
      </animated.svg>
    );
}

function Birthday() {
  const spring = useSpring({
    bottom: "100%",
    from: { bottom: "-100%" },
    config: { duration: 2000 },
  });

  const spring2 = useSpring({
    to: { opacity: "1" },
    from: { opacity: "0" },
    delay: 2100,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  return (
    <div className="birthdayWrapper">
      <animated.div style={{ zIndex: 50, position: "absolute", ...spring }}>
        <img alt="balloons" src="balloon.png" />
      </animated.div>
      <animated.div
        style={{
          backgroundColor: "#e63946",
          color: "#f1faee",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          ...spring2,
        }}
      >
        🥳 Happy Birthday Dad! 🎂
      </animated.div>
    </div>
  );
}

export default App;
