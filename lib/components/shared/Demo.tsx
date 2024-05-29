import { Box, Button, Divider, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { BsGrid1X2Fill } from "react-icons/bs";

/**
 * The shared header component.
 */

type DemoProps = {
    title: String,
    description: String,
    children: React.ReactNode
}

export default function Demo({
    title,
    description,
    children,
  }: DemoProps) {
  return (
    <Box w={"100%"}>
      <VStack spacing={'5'} mt="2" alignItems={"left"}>
        <Heading px={5}>{title}</Heading>
        <Divider />
        <VStack px={5} spacing={'5'}>
          <Text>{description}</Text>
          {children}
        </VStack>
      </VStack>
    </Box>
  )
}