import { Button, HStack, Icon, IconButton, Image, Link, Spacer } from '@chakra-ui/react'
import { BsGrid1X2Fill, BsGithub } from "react-icons/bs";

/**
 * The shared header component.
 */
export default function Header() {
  return (
    <HStack w={"100%"} px={3} py={2} spacing={5}>
      <IconButton aria-label='Demos' colorScheme={"blue"} icon={<BsGrid1X2Fill />}  />
      <Button w={200} colorScheme={"blue"}>Choose File</Button>
      <Spacer/>
      <Link href='http://www.google.ca'>
        <Icon as={BsGithub} boxSize={"8"} />
      </Link>
    </HStack>
  )
}