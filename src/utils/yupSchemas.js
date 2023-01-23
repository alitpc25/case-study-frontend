import * as Yup from "yup"

export const CreateCandidateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    mail: Yup.string().email().required("Mail is required"),
    phone: Yup.string().required("Phone is required"),
    status: Yup.string().required("Status is required")
});

export const CreateInteractionSchema = Yup.object().shape({
    interactionType: Yup.string().required("Type is required"),
    content: Yup.string().required("Content is required"),
    date: Yup.date().required("Date is required"),
    candidateResponded: Yup.string().required("Response is required")
});

export const UpdateInteractionSchema = Yup.object().shape({
    interactionType: Yup.string().required("Type is required"),
    content: Yup.string().required("Content is required"),
    date: Yup.date().required("Date is required"),
    candidateResponded: Yup.string().required("Response information is required")
});

export const UpdateCandidateSchema = Yup.object().shape({
    mail: Yup.string().email().required("Mail is required"),
    phone: Yup.string().required("Phone is required"),
    status: Yup.string().required("Status is required")
});