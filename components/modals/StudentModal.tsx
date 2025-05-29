"use client"

import type React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Link,
} from "@chakra-ui/react"

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: {
    id: string
    name: string
    email: string
    major: string
  } | null
}

const StudentModal: React.FC<StudentModalProps> = ({ isOpen, onClose, student }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Student Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {student ? (
            <Box>
              <Text fontWeight="bold">Name:</Text>
              <Text>{student.name}</Text>
              <Text fontWeight="bold">Email:</Text>
              <Text>{student.email}</Text>
              <Text fontWeight="bold">Major:</Text>
              <Text>{student.major}</Text>
            </Box>
          ) : (
            <Text>No student selected.</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          {student && (
            <Link href="/book-consultation" isExternal>
              <Button colorScheme="green">Book Consultation</Button>
            </Link>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StudentModal
