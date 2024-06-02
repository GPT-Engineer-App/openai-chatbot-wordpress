import React, { useState } from "react";
import { Container, VStack, Box, Input, Button, Text, Flex } from "@chakra-ui/react";

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          prompt: input,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.choices[0].text.trim() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Box width="100%" height="60vh" border="1px solid #ccc" borderRadius="md" overflowY="auto" p={4}>
          {messages.map((msg, index) => (
            <Flex key={index} justify={msg.sender === "user" ? "flex-end" : "flex-start"} mb={2}>
              <Box bg={msg.sender === "user" ? "blue.500" : "gray.200"} color={msg.sender === "user" ? "white" : "black"} p={2} borderRadius="md">
                <Text>{msg.text}</Text>
              </Box>
            </Flex>
          ))}
        </Box>
        <Flex width="100%">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            mr={2}
          />
          <Button onClick={handleSend} colorScheme="blue">Send</Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default Index;