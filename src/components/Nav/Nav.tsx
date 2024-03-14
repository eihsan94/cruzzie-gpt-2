/* eslint-disable @typescript-eslint/no-misused-promises */
import { Navbar, Button, Text } from "@nextui-org/react";
import Link from "next/link";
import { Logo } from "../Logo";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
const menu = [
  {
    label: "Chat",
    routes: "/",
  },
  // {
  //   label: "Dashboard",
  //   routes: "/dashboard",
  // },
];

export default function Nav() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const auth = async () => {
    if (sessionData) {
      await signOut();
    } else {
      await signIn("google", { callbackUrl: "/" });
    }
  };

  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Brand>
        <Logo />
        <Text b color="inherit" hideIn="xs" style={{ marginLeft: "1em" }}>
          CruzzieGPT
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs">
        <Button.Group color="gradient">
          {menu.map((item, i) => (
            <Button
              key={i}
              ghost={router.route !== item.routes}
              onClick={() => router.push(item.routes)}>
              {item.label}
            </Button>
          ))}
        </Button.Group>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Link color="inherit" onClick={auth}>
          {sessionData ? "Logout" : "Login"}
        </Navbar.Link>
        {!sessionData && (
          <Navbar.Item>
            <Button auto flat as={Link} href="#">
              Sign Up
            </Button>
          </Navbar.Item>
        )}
        <Navbar.Toggle showIn="xs" />
      </Navbar.Content>
      <Navbar.Collapse>
        {menu.map((item, i) => (
          <Navbar.CollapseItem key={i}>
            <Link
              style={{
                minWidth: "100%",
                color: "black",
              }}
              href={item.routes}>
              {item.label}
            </Link>
          </Navbar.CollapseItem>
        ))}
        <Navbar.CollapseItem>
          <Link
            color="inherit"
            onClick={auth}
            href="#"
            style={{
              minWidth: "100%",
              color: "black",
            }}>
            {sessionData ? "Logout" : "Login"}
          </Link>
        </Navbar.CollapseItem>
        {!sessionData && (
          <Navbar.CollapseItem>
            <Link color="inherit" onClick={auth} href="#">
              Sign Up
            </Link>
          </Navbar.CollapseItem>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
