import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // <-- Add this import

const consentText = `
# Informed Consent Document

**Title:** Understanding Input Techniques for Communicating with Generative AI

**Researcher(s):**  
Jay Henderson  
Department of Computer Science, Memorial University  
[jayhend@mun.ca](mailto:jayhend@mun.ca)  

**Nishant Rathore**  
Department of Computer Science, Memorial University  
[nr6333@mun.ca](mailto:nr6333@mun.ca)

---

## Purpose of study:

The goal of this study is to understand the impact of text entry input technique on written prompts for generative AI (either a large language model, e.g. ChatGPT, or an image generation model, e.g. DALLE 3). We want to see if the input technique impacts:  
1. subjective quality of the prompt,  
2. subjective quality of the model's output,  
3. length of the prompt,  
4. time taken to write the prompt,  
5. psychological ownership of the produced output, and  
6. subjective preference of input technique.

---

## What you are being invited to do in this study:

Participants will be required to write a prompt for a large language model to create a short story (ChatGPT) or for an image generation model to match a description (DALLE 3) for the following conditions: **keyboard text entry and speech text entry**. For each condition, participants will be given approximately **7 minutes**. After each condition, participants will be required to fill out several surveys from the literature including: the systems usability scale, the NASA TLX, and a psychological ownership questionnaire.

While we will only record the outputted text as recorded from speech input, and decoded through your tablet microphone, the web application will require permission to access the microphone for obtaining speech data. **The survey and demographic data collected from you as part of your participation in this project will be stored electronically by AWS through Vercel and Render.**

---

## **Consent**:

This research has been approved by the Interdisciplinary Committee on Ethics in Human Research (ICEHR). If you have ethical concerns about the research, such as the way you have been treated or your rights as a participant, you may contact the ICEHR at [icehr@mun.ca](mailto:icehr@mun.ca) or by telephone at 709-864-2861.

By completing this online study you agree that:
- You have read the information about the research.
- You have been advised that you may ask questions about this study and receive answers prior to continuing.
- You are satisfied that any questions you had have been addressed.
- You understand what the study is about and what you will be doing.
- You understand that you are free to withdraw participation from the study by closing your browser window or navigating away from this page, without having to give a reason and that doing so will not affect you now or in the future.
- You understand that this data is being collected anonymously and therefore your data **cannot** be removed once you submit this survey.

By consenting to this online study, you do not give up your legal rights and do not release the researchers from their professional responsibilities.

Please retain a copy of this consent document for your records.

**Clicking accept below and submitting this survey constitutes consent and implies your agreement to the above statements.**

---

## **The total time to participate in the study will be approximately 45 minutes.**

You will be compensated with $12 USD **per hour** of participation. Should you choose to withdraw at any time, you will be compensated by the amount of time participated. Participants may skip any questions that they do not wish to answer.

---

## **Anonymity and Confidentiality**:

Participation in an online study via Prolific that does not collect any identifying information is anonymous, and the data is also anonymous.

Analysis will be conducted and reported on aggregate data, not for individual participants (e.g. for demographic data, we had participants in an age range of X-Y, mean of Z, s.d. of W. Our sample consisted of X women, Y men, Z non-binary, W self-identified as other, and U chose not to disclose). The majority of data will be quantitative in nature (e.g. numerical survey results), as well as self-reported preference or subjective task load (how demanding the task is). Some participants may elect to provide additional insights on their preference. If quotes are used, they will be reported anonymously, e.g. “One participant said [...]”.

---

## **Withdrawal from the Study**:

If you wish to withdraw at any time, you may do so by "returning" the study as outlined in the help section on prolific by messaging the experimenter in the internal messaging system on Prolific and clicking the red return arrow. The experimenter will then use the “bonus” feature to provide reimbursement based on time spent on the experiment.

If you withdraw during data collection their data will be destroyed.

Since data will be collected anonymously, if you withdraw after the data collection period, your data cannot be removed.

---

## **Use, Access, Ownership, and Storage of Data**:

Data will be accessible on AWS by Dr. Jay Henderson **and Nishant Rathore**. **Electronic data will be stored on AWS, Google Forms, on Dr. Jay Henderson's personal research computer, and on Nishant Rathore’s personal research computer.**

Anonymized data will be retained for a minimum of 5 years and stored on GitHub, after which it may be disposed of if required. For scientific integrity and replicability, anonymized data, including demographic details (i.e. gender, age), will be available electronically as meta-data for the publication on a digital library (e.g. ACM Digital Library) and stored there indefinitely.

Privacy policies for platforms used can be found as follows:  
Prolific: [https://prolific.notion.site/395a0b3414cd484a2557566256e3d58?v=b20651a3539d48f083c98923511b457d](https://prolific.notion.site/395a0b3414cd484a2557566256e3d58?v=b20651a3539d48f083c98923511b457d)  
GitHub: [https://docs.github.com/en/site-policy/policies/github-general-privacy-statement](https://docs.github.com/en/site-policy/policies/github-general-privacy-statement)  
AWS: [https://aws.amazon.com/privacy/](https://aws.amazon.com/privacy/)  
Vercel: [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)  
Render: [https://render.com/privacy](https://render.com/privacy)
Google Forms: [https://transparency.google/our-policies/product-terms/google-forms/](https://transparency.google/our-policies/product-terms/google-forms/) and [https://policies.google.com/privacy](https://policies.google.com/privacy)

---

## **Possible Risks**:

There are no foreseeable risks beyond those experienced in a typical workday.

---

## **Possible Benefits**:

With the increase in popularity and capability of AI, it's important to understand how people can use it as a tool, without losing connection or ownership of content produced (i.e. preserving creativity of people). This work will be a step in understanding best practices for using these technologies.

---

## **Reporting and Sharing Results**:

Participants will be able to access the disseminated results in a conference proceeding from the ACM Digital Library or my personal website, jayhenderson.ca.

---

## **Questions**:

You are welcome to ask questions before, during, or after your participation in this research using the internal Prolific chat system. If you would like more information about this study, please contact: [jayhend@mun.ca](mailto:jayhend@mun.ca).
`;

const ConsentPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 5;
      if (isBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleContinue = () => {
    navigate("/demographic");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Informed Consent Form
      </motion.h1>
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[32rem] overflow-y-auto border border-gray-200 rounded-lg p-10 mb-10 bg-gray-50 text-left"
          style={{ minHeight: "250px", lineHeight: "2" }}
        >
          <div className="prose prose-blue max-w-none prose-lg prose-p:mb-8 prose-h2:mt-12 prose-h2:mb-6 prose-h3:mt-10 prose-h3:mb-4 prose-li:mb-3 prose-ul:mb-8 prose-ol:mb-8 prose-headings:text-left prose-p:text-left prose-ul:text-left prose-ol:text-left">
            <ReactMarkdown>{consentText}</ReactMarkdown>
          </div>
        </div>
        <div className="flex items-center space-x-3 mb-8">
          <input
            type="checkbox"
            id="consent"
            disabled={!hasScrolledToBottom}
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-5 h-5 accent-blue-600"
          />
          <label
            htmlFor="consent"
            className="text-gray-800 text-base select-none"
          >
            I have read and agree to the terms above.
          </label>
        </div>
        <motion.button
          onClick={handleContinue}
          disabled={!isChecked}
          whileHover={{ scale: isChecked ? 1.02 : 1 }}
          whileTap={{ scale: isChecked ? 0.98 : 1 }}
          className={`w-full px-6 py-4 rounded-lg text-lg font-semibold shadow-md transition-all duration-300
            ${
              isChecked
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ConsentPage;
