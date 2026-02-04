import type { ReactQuiz } from '../types/reactQuiz';

export const quiz = {
  quizTitle: "AWS AI Practitioner Quiz",
  quizSynopsis:
    "Test your knowledge with this sample quiz covering all 5 domains of the AWS AI Practitioner exam. Each question is designed to reflect real exam topics, helping you identify your strengths and focus your study efforts. Take the quiz to boost your confidence and get one step closer to certification success!",
  progressBarColor: "#9de1f6",
  nrOfQuestions: "17",
  questions: [
    {
      question:
        "An ML engineer *wants a foundation model (FM)* that can participate in a *multi-turn chatbot environment*. Which *solution* will *meet these requirements*?",
      questionType: "text",
      questionPic: "", // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "RAG",
        "Instruction-based fine-tuning",
        "Domain adaptation fine-tuning",
        "Prompt engineering",
      ],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        *Correct. Instruction-based fine-tuning is a fine-tuning technique that uses labeled data to improve large language model (LLM) performance on a specific task. You can use instruction-based fine-tuning to teach a model how to correspond with users in a multi-turn chatbot environment. 
        
        Incorrect. Domain adaptation fine-tuning is a method of fine-tuning large language models (LLMs). Domain adaptation fine-tuning can expand an LLM's knowledge of a given domain, such as learning about industry jargon or technical terms. The scenario does not require the model to learn new domain-specific language. You cannot use domain adaptation fine-tuning to teach an FiM to correspond with users in a multi-turn chatbot environment.

        Incorrect. Prompt engineering is the process of manipulating the prompt for a large language model (LLM) to guide the LLM's behavior and responses. You cannot use prompt engineering to teach a model to have a multi-turn conversation with a user.

        Incorrect. You can use RAG to provide a large language model (LLM) with context on recent events that have transpired after the LLM has already been trained. RAG can help to reduce an LLM's hallucinations. You cannot use RAG to make an LLM participate in a multi-turn chatbot environment.
      `,
      point: "1",
    },
    {
      question:
        "A news company *wants to increase its click-through rate* by providing the most relevant news to each subscriber. Which AWS service will meet these requirements with the LEAST operational overhead?",
      questionType: "text",
      questionPic: "", // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "Amazon Personalize",
        "Amazon Comprehend",
        "Amazon Kendra",
        "Amazon Bedrock",
      ],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        *Correct. Amazon Personalize is a fully managed Al service that uses data to generate item recommendations for your users. You can use Amazon Personalize to provide the most relevant news to each subscriber. Amazon Personalize is specifically designed for this kind of use case. You can access the service directly through an API. Therefore, Amazon Personalize provides the least operational overhead. 
        
        Incorrect. Amazon Comprehend is a fully managed Al service that extracts insights by recognizing entities, key phrases, language, or sentiment in documents. Amazon Comprehend cannot provide recommendations.

        Incorrect. Amazon Kendra is a fully managed service that provides intelligent search by using semantic and contextual understanding capabilities. Amazon Kendra can decide whether a document is relevant to a search query. You cannot use Amazon Kendra as a recommendation engine for application users.

        Incorrect. Amazon Bedrock is a fully managed service that provides access to high-performing foundation models (FMs). Amazon Bedrock also provides a set of tools to customize, evaluate, and safeguard the models. You could use Amazon Bedrock to implement a recommendation engine. However, this solution would require model customization. Additionally, this solution might require retrieval augmented generation (RAG) components. Therefore, this solution requires additional operational overhead.
      `,
      point: "1",
    },
    {
      question:
        "A medical device company recently added Al-generated product overviews to its online product catalog. The company wants to incorporate industry-specific terminology to improve the outputs that are generated. An ML team has access to a large volume of unlabeled industry-specific standards and research. Which ML technique will meet these requirements?",
      questionType: "text",
      questionPic: "", // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "Use retrieval augmented generation (RAG) to include relevant terminology.",
        "Customize the foundation model (FM) by using instruction-based fine-tuning on the industry dataset.",
        "Use prompt engineering to include an edited sample in the next prompt.",
        "Customize the foundation model (FM) by using continued pre-training on the dataset.",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        *Correct. Continued pre-training of FMs can help the model understand industry-specific terminology. You can use large, unlabeled datasets to perform continued pre-training. You can continue pre-training the FM by using the unlabeled industry dataset. Future responses from the resulting custom model will more consistently incorporate terminology from the industry dataset. 
        
        Incorrect. RAG is a prompt engineering technique that incorporates relevant search results as context from a prompt to an FM. You could index the internal data and industry documentation as a RAG source and search for relevant context to include in a prompt. You could search the industry dataset for relevant terminology and include the terminology as context in each prompt. However, this technique does not improve the model's ability to incorporate industry-specific terminology in future responses.

        Incorrect. Instruction-based fine-tuning uses labeled examples to train an FM. You can use this method to customize responses based on task-specific data. Model parameters can adjust based on tasks that are encountered during fine-tuning on a labeled dataset. Fine-tuning a model would incorporate relationships between inputs and outputs that are encountered in the fine-tuning dataset. However, instruction-based fine-tuning requires a labeled dataset. The large industry dataset in the scenario is an unlabeled dataset.

        Incorrect. Prompt engineering is a technique to optimize the inputs to FMs with the goal of generating better responses. To include an example output in a prompt can help a model understand output format and style and the relationship of inputs and outputs. An FM does not retain context between prompts. An agent or generative Al application can retain information for a sequence of prompts. However, prompt engineering does not change a model's response beyond the single prompt or series of actions. Therefore, to include the sample in the next prompt would not improve the model's ability to incorporate industry-specific terminology in future responses.
      `,
      point: "1",
    },
    {
      question:
        "A company wants to use a large language model (LLM) to learn language that is specific to the company's domain. The company has a large amount of unlabeled data that contains domain-specific language. Which solution will meet these requirements with the LEAST operational overhead?",
      questionType: "text",
      questionPic: "", // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "Fine-tune the LLM by using the company's data.",
        "Provide the company's data as context in the prompt for the LLM.",
        "Conduct continued pre-training on the LLM by using the company's data.",
        "Train a new LLM by using the company's data.",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        *Correct. Continued pre-training improves a model's performance by providing unlabeled data so the model can learn domain-specific knowledge. This solution will train the model on the company's data. Then, the model can respond with language that is specific to the company's domain. 
        
        Incorrect. To train a new LLM would be costly and time-consuming for the company. Additionally, the company does not need to train a new LLM to achieve responses that contain domain-specific language. Instead, continued pre-training can train a model to learn language and domain-specific knowledge by using unlabeled data. Continued pre-training requires less operational overhead than training a new LLM.

        Incorrect. A solution that provides the company's data as context in the LLM prompt would not meet the requirements. The model would not learn domain-specific language from large amounts of company data in the prompts.

        Incorrect. Fine-tuning improves a model's performance for a given task by using labeled data. The company does not have labeled data. Therefore, the company would not be able to use fine-tuning for this task.
      `,
      point: "1",
    },
    {
      question:
        "A company is exploring generative Al foundation models (FMs) to build a domain-specific text-based solution. The solution will be used internally to generate blog posts and marketing content that will be published on the company's external website. What is a risk the company must consider when using generative AI?",
      questionType: "text",
      questionPic: "", // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "Intellectual property (IP) infringement claims",
        "Prompt injection attacks",
        "Increased operational cost",
        "Violation of data privacy regulations",
      ],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        *Correct. IP infringement occurs when generated content is similar to existing copyrighted material. IP infringement is a risk when you use generative Al to generate content for blog posts and online content. Generative Al FMs are trained on vast datasets that can include copyrighted material.
        
        Incorrect. When you implement a generative Al solution, you can incur setup costs to use or maintain an application. However, the costs are not a risk that is associated with using generative Al for this use case. Additionally, with AWS you pay for only what you use. Increased operational cost are more likely from use cases such as creating a large language model (LLM) by yourself.

        Incorrect. A prompt injection attack occurs when malicious inputs are provided to an Al or ML model to generate inappropriate or harmful output. Prompt injection attacks are a security concern especially when the Al application is available for public use. However, the company is using generative Al to create blog posts and online content, not an Al application. Therefore, prompt injection attacks are not a risk for this use case.

        Incorrect. Data privacy regulations are an important component of any business to ensure customer and personal data remains private. However, when you use generative Al to create blog posts and online content, you do not use personal data. Data privacy violations are not a risk for this use case.
      `,
      point: "1",
    },
    {
      question:
        "The company wants to accurately identify historic audio files that contain the company's brand and convert the files to text for further analysis. The historic audio files are stored in Amazon S3. Which combination of steps will meet these requirements? (Select TWO.)",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "(A) Create a batch transcription job in Amazon Transcribe.",
        "(B) Create a real-time transcription job in Amazon Transcribe.",
        "(C) Create a transcription job in Amazon Translate.",
        "(D) Use custom vocabularies to improve the transcription accuracy.",
        "(E) Use custom language models to improve the transcription accuracy.",
      ],
      correctAnswer: [1, 4],
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        A is a possible correct answer. Amazon Transcribe is a service that you can use to convert speech into text. You can use Amazon Transcribe to facilitate the transcription of audio recordings. Amazon Transcribe has two types of transcription jobs, batch and streaming. Batch jobs work with data, historic, that has been previously uploaded to Amazon S3. Streaming jobs transcribe media in real time, and because the data consists of historic audio files that are stored in Amazon S3, you must use a batch transcription job. But even though this is a possible correct answer, it is best practice to first review all of the answer options and then choose your best answer.

        B is incorrect. Because the data consists of historic audio files that are stored in Amazon S3, you must use a batch transcription job. You cannot use real-time transcription for historic data that is stored in Amazon S3. 

        C is also incorrect. Amazon Translate is a service that you can use to provide translations between multiple languages. You cannot use Amazon Translate to convert audio speech to text. 

        D is another possible correct answer. In Amazon Transcribe, if media contains domain-specific or non-standard terms, you can use a custom vocabulary or a custom model to improve the accuracy of the transcriptions. Examples of domain-specific and non-standard terms include brand names, acronyms, technical words, and jargon. In the case of a limited number of words, a custom vocabulary is recommended. To identify the company's brand name would require a limited number of words. Therefore, you can use this step to improve the transcription accuracy. 

        E is incorrect. We already discussed how Amazon Transcribe can be used to have a custom vocabulary or a custom model to improve the accuracy of the transcriptions. We also covered what domain-specific terms can include. To identify the company's brand name would require a limited number of words. You would use a custom model if the domain is too complex or if you must provide a complex taxonomy because the domain is very specific. The company wants to accurately identify historic audio files that contain the company's brand. Therefore, you do not need a custom language model in this scenario. So that makes options A and D correct.
      `,
      point: "1",
    },
    {
      question:
        "A company wants to gain insights from diverse data sources and formats to improve business operations. The data sources include audio from call centers, text feedback from customers, product images, and scanned documents. Which AWS service can identify the global sentiment of customer feedback from text?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Amazon Translate",
        "Amazon Comprehend",
        "Amazon Transcribe",
        "Amazon Polly",
      ],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Amazon Translate is incorrect. Amazon Translate is a service that provides translation between multiple languages. You cannot use Amazon Translate to identify sentiment from text. 

        Amazon Comprehend is a possible correct answer. Amazon Comprehend is a natural language processing, or NLP, service that extracts insights and relationships from text data by using ML. You can use Amazon Comprehend to understand the sentiment of customer feedback and text. 

        Amazon Transcribe is incorrect. Amazon Transcribe is a service that you can use to convert speech into text. Amazon Transcribe can facilitate the transcription of audio recordings. However, you cannot use Amazon Transcribe to identify the sentiment of customer feedback.

        Amazon Polly is incorrect. Amazon Polly is a text-to-speech service that you can use to convert text into lifelike speech. You cannot use Amazon Polly to identify the sentiment of customer feedback. So that makes option B the correct answer.
      `,
      point: "20",
    },
    {
      question:
        "A retail company wants to start testing Amazon Bedrock foundation models (FMs) for text generation in customer-facing natural language applications. How will the company be charged for using on-demand Amazon Bedrock models?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "(A) By the number of API calls",
        "(B) By the number of input tokens that are processed",
        "(C) By a monthly subscription fee",
        "(D) By the number of input tokens that are received and the number of output tokens that are generated",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is incorrect. On-demand Amazon Bedrock models are not charged by the number of API calls that are made. On-demand Amazon Bedrock models for text generation are charged by the number of input tokens that are received and the number of output tokens that are generated. 

        Option B is incorrect. Embedding models are charged by the number of input tokens that are processed. However, on-demand Amazon Bedrock models are not charged that way. On-demand Amazon Bedrock models for text generation are charged by the number of input tokens that are received and the number of output tokens that are generated. 

        Option C is incorrect. On-demand Amazon Bedrock models for text generation are charged by the number of input tokens that are received and the number of output tokens that are generated. Amazon Bedrock pricing is not charged by a monthly subscription fee.

        Option D correct. On-demand Amazon Bedrock models for text generation are charged by the number of input tokens that are received and the number of output tokens that are generated. You pay for what you use. You do not need to commit to long-term contracts. 
      `,
      point: "20",
    },
    {
      question:
        "An ML engineer wants to implement Retrieval Augmented Generation (RAG) for a foundation model (FM). The ML engineer must select a database service that supports similarity search and that can store vector embeddings for RAG implementation. Which AWS services will meet these requirements? (Select TWO.)",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "(A) Amazon OpenSearch Service",
        "(B) Amazon DynamoDB",
        "(C) Amazon Redshift",
        "(D) Amazon RDS for MySQL",
        "(E) Amazon RDS for PostgreSQL",
      ],
      correctAnswer: [1, 5], // A and C (indexes start from 1)
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is a possible correct answer. OpenSearch Service is a managed service that you can use to deploy and manage OpenSearch clusters. OpenSearch Service is a suitable solution for a vector store because OpenSearch Service has built in K nearest neighbor, KNN, and semantic search capabilities. You can use either of these capabilities to find similar embeddings.

        Option B is incorrect. DynamoDB is a fully managed serverless NoSQL database that provides low-latency lookups of items based on keys. DynamoDB is a key-value database that does not have similarity search capabilities. Therefore, you cannot use DynamoDB as a vector store for RAG implementation.

        Option C is incorrect. Amazon Redshift is a fully managed columnar petabyte-scale data warehouse on AWS. Amazon Redshift is not suitable as a vector store. Amazon Redshift can run complex SQL queries for reporting purposes. You would not use Amazon Redshift to search for similar data in a multi-dimensional vector space.

        Option D is incorrect. You can use Amazon RDS to deploy and manage relational databases that support a variety of database engines, including MySQL. However, RDS from MySQL does not support similarity search of a multi-dimensional vector space. Therefore, RDS for MySQL is not suitable for a vector store.

        Option E is correct. You can use Amazon RDS to deploy and manage relational databases that support a variety of database engines, including PostgreSQL. The PostgreSQL database engine supports the pgvector extension. The pgvector extension can provide vector similarity search capabilities for PostgreSQL. Therefore, RDS for PostgreSQL is a suitable solution for a vector database.
      `,
      point: "20",
    },
    {
      question:
        "An online education company is developing an Al teaching assistant by using a foundation model (FM). The company wants to ensure that the Al teaching assistant can understand and follow directions and can provide guided responses. Which technique should the company use to meet these requirements?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "(A) Pre-training",
        "(B) Instruction tuning",
        "(C) Domain adaptation",
        "(D) Continuous pre-training",
      ],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is incorrect. Pre-training refers to the process of training a model on a large dataset before fine-tuning the model. The company already uses an FM, therefore, the model has already been pre-trained on large amounts of data. You cannot use pre-training to ensure that the AI teaching assistant can understand and follow directions or provide guided responses.

        Option B is a possible correct answer. Instruction tuning refers to the process of providing specific labeled examples to train a model on a specific task. Instruction tuning can help models follow specific tasks or responses to prompts in a specific way. Therefore, this technique can improve the model's performance. Instruction tuning will improve the model by teaching the model how to understand and follow directions.

        Option C is incorrect. Domain adaptation refers to the technique that you can use to fine-tune a model on a specific domain or context. Domain adaptation can be helpful for use cases that require the model to understand industry-specific terminology or language. You cannot use domain adaptation to ensure that the AI teaching assistant can understand and follow directions or provide guided responses.

        Option D is incorrect. Continuous pre-training refers to the continual training process that you can perform on an ML model when new data becomes available. Continuous pre-training is helpful to reduce data drift and to ensure that model performance stays consistent. You cannot use continuous pre-training to ensure that the AI teaching assistant can understand and follow directions or provide guided responses.
      `,
      point: "20",
    },
    {
      question:
        "A company has a foundation model (FM) in Amazon Bedrock that provides answers to employee questions. The company wants to prevent inappropriate user input and model output. Which feature of Amazon Bedrock can the company use to meet these requirements?",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["FMs", "Guardrails", "Knowledge bases", "Agents"],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is incorrect. FMs and Amazon Bedrock are models that have been trained on large amounts of data with many parameters. You can train an FM to avoid inappropriate or harmful information. However, the FM on its own does not prevent inappropriate user input or output.

        Option B is a possible correct answer. You can use Amazon Bedrock Guardrails to prevent or filter inappropriate content from user input and output. You can customize Amazon Bedrock Guardrails with policies to implement responsible AI policies.

        Option C is incorrect. You can use Amazon Bedrock knowledge bases to provide contextual information based on the retrieval augmented generation, RAG, technique. You can use a knowledge base to create a RAG application that provides responses based on the information that is received. You cannot use Amazon Bedrock knowledge bases to prevent inappropriate user input or output.

        Option D is incorrect. You can use Amazon Bedrock Agents to create generative AI applications that can accomplish complex tasks. Agents can orchestrate interactions between model components such as the FM, data source, and user conversations. You cannot use Amazon Bedrock Agents to prevent inappropriate user input or output.
      `,
      point: "20",
    },
    {
      question:
        "A company must ensure that it has a mechanism to observe the inner mechanics of a model. The company must understand exactly how the model generates a prediction. Which concept matches this description?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "(A) Interpretability",
        "(B) Explainability",
        "(C) Guardrails",
        "(D) Model evaluation",
      ],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is a possible correct answer. Interpretability is the process of understanding the inner mechanics of a model. The goal is to explain how the model generates a prediction. To explain model behavior in human terms is not the goal. The intent is to be transparent about the model's inner mechanics.

        Option B is incorrect. Explainability is the process of explaining a model's behavior in human terms. Explainability does not focus on exactly how each model weight and input data contributes to the behavior of the model. Therefore, this concept does not focus on understanding the inner mechanics of a model.

        Option C is incorrect. Guardrails are policies or methods to secure ML and AI resources. You can implement guardrails to secure resources that are related to ML environments. You can use guardrails to filter harmful or inappropriate user input or model output. Guardrails are not related to understanding the inner mechanics of a model.

        Option D is incorrect. Model evaluation is a stage in the ML development lifecycle, where you test the model to determine how well the model performs. You typically evaluate a model after the model has been trained. You can evaluate for performance and success metrics. Model evaluation is not related to understanding the inner mechanics of a model.
      `,
      point: "20",
    },
    {
      question:
        "A company uses Amazon SageMaker to deploy ML models. The company must identify a way to document important details about the ML models in one place to help with reporting and governance throughout the model lifecycle. Which feature of SageMaker will meet these requirements?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "SageMaker Model Cards",
        "SageMaker foundation model evaluations (FMEval)",
        "SageMaker Data Wrangler",
        "SageMaker Ground Truth",
      ],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is a possible correct answer. You can use SageMaker Model Cards to document important details about an ML model in one place. SageMaker Model Cards can help streamline reporting and governance. Remember to review all answer options to choose your best choice answer. 

        Option B is incorrect. You can use FMEval to evaluate an ML model for risks such as toxic content and inaccuracy. You can use FMEval to help choose the most suitable model for a specific use case. FMEval does not help with documenting model details in one place. 

        Option C is incorrect. You can use SageMaker Data Wrangler as a preprocessing and feature engineering tool for ML workflows. SageMaker Data Wrangler requires minimal or no code. You cannot use SageMaker Data Wrangler to document the critical details of an ML model in one place. 

        Option D is incorrect. You can use SageMaker Ground Truth to create high-quality datasets for model training. SageMaker Ground Truth uses humans to label data for training. You cannot use SageMaker Ground Truth to document model details. 
      `,
      point: "20",
    },
    {
      question:
        "A company plans to use AWS generative AI services to build an enterprise chatbot solution. The company must provide documentation that demonstrates that AWS complies with regulatory standards for AI systems. Which AWS service provides access to compliance reports?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "(A) AWS Trusted Advisor",
        "(B) AWS Audit Manager",
        "(C) Amazon Inspector",
        "(D) AWS Artifact",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        Option A is incorrect. Trusted Advisor is a service that runs inspections on your AWS environment. Trusted Advisor can provide recommendations to optimize costs, improve performance, or address security issues. Trusted Advisor does not provide AWS compliance reports for customers. 

        Option B is incorrect. Audit Manager is a service that continuously audits your AWS environment usage. Audit Manager can manage risk and compliance by using regulations and industry standards. Audit Manager does not provide AWS compliance reports for customers. 

        Option C is incorrect. Amazon Inspector is a service that you can use to improve the security and compliance of applications that are deployed on AWS. Amazon Inspector does not provide AWS compliance reports for customers.Option C is incorrect. Amazon Inspector is a service that continually scans AWS workloads for software vulnerabilities and unintended networking exposure. Amazon Inspector can create findings to describe vulnerabilities, then Amazon Inspector can specify the affected resources and provide remediation guidance on how to fix the vulnerabilities. But Amazon Inspector does not provide AWS compliance reports for customers. 

        Option D correct. AWS Artifact provides a centralized location to download compliance-related reports and information from AWS. You can use AWS Artifact to obtain compliance reports and regulatory standards related to AI systems on AWS. 
      `,
      point: "20",
    },
    {
      question:
        "A company is exploring generative AI foundation models (FMs) to build a domain-specific text-based solution. The solution will be used internally to generate blog posts and marketing content that will be published on the company's external website. What is a risk the company must consider when using generative AI?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "(A) Increased operational cost",
        "(B) Violation of data privacy regulations",
        "(C) Intellectual property (IP) infringement claims",
        "(D) Prompt injection attacks",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        C Correct. IP infringement occurs when generated content is similar to existing copyrighted material. IP infringement is a risk when you use generative Al to generate content for blog posts and online content. Generative Al FMs are trained on vast datasets that can include copyrighted material.
        
        A Incorrect. When you implement a generative Al solution, you can incur setup costs to use or maintain an application. However, the costs are not a risk that is associated with using generative Al for this use case. Additionally, with AWS you pay for only what you use. Increased operational cost are more likely from use cases such as creating a large language model (LLM) by yourself.

        B Incorrect. Data privacy regulations are an important component of any business to ensure customer and personal data remains private. However, when you use generative Al to create blog posts and online content, you do not use personal data. Data privacy violations are not a risk for this use case.
        
        D Incorrect. A prompt injection attack occurs when malicious inputs are provided to an Al or ML model to generate inappropriate or harmful output. Prompt injection attacks are a security concern especially when the Al application is available for public use. However, the company is using generative Al to create blog posts and online content, not an Al application. Therefore, prompt injection attacks are not a risk for this use case.
      `,
      point: "20",
    },
    {
      question:
        "A global communications company is building an AI-assisted tool to scale customer chat capabilities. All generated chat responses must be positive, friendly, and unbiased. Which evaluation approach will identify foundation models (FMs) that will meet these requirements at scale?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "(A) Use Amazon SageMaker Clarify to detect bias in a historical customer chat dataset.",
        "(B) Use AWS AI Service Cards to review the example benchmark performance of each model.",
        "(C) Use Amazon Augmented AI (Amazon A2I) to review responses before sending to customers.",
        "(D) Use Amazon SageMaker Clarify to quantify model toxicity on a test dataset.",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        A Incorrect. SageMaker Clarify is a feature of SageMaker that can explain model responses and can detect bias in training datasets or model responses. You can use SageMaker Clarify to identify bias in historical customer chat data if you are preparing the historical data for training or fine-tuning. However, this evaluation approach would not help you identify which FM meets the requirements.

        B Incorrect. AWS Al Service Cards describe FMs that are developed by AWS Al services. Service cards can include sample performance data for commonly used benchmarking datasets. However, each model provider determines what information to share about the models that the provider develops. AWS Al Service Cards do not describe open source and third-party models. Additionally, you should perform testing by using datasets for a specific use case, rather than using sample benchmark data.

        C Incorrect. Amazon A2l provides a workflow for the human audit of selected responses. Collecting human feedback on responses to test prompts during model selection could be helpful in the evaluation of tone and toxicity. However, this approach involves human review of production responses. Therefore, this approach will not be helpful for initial model selection.

        D Correct. SageMaker Clarify is a feature of SageMaker that helps you explain how a model makes predictions and whether datasets or models reflect bias. SageMaker Clarify also includes a library to evaluate FM performance. The foundation model evaluation (FMEval) library includes tools to compare FM quality and responsibility metrics, including bias and toxicity scores. FMEval can use built-in test datasets, or you can provide a test dataset that is specific to your use case.
      `,
      point: "20",
    },
    {
      question:
        "A company is exploring human-centered design solutions for an ML model that it is developing. Which solutions are part of the reinforcement learning from human feedback (RLHF) design? (Select TWO.)",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "(A) Feature engineering",
        "(B) Supervised fine-tuning of a regression model",
        "(C) Supervised fine-tuning of a language model",
        "(D) Using a reward model",
        "(E) Evaluating a reward model by using mean squared error (MSE)",
      ],
      correctAnswer: [3, 4],
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation: `
        A Incorrect. Feature engineering is a stage in the ML development lifecycle to select and transform raw data into variables. Feature engineering is not related to RLHF.

        B Incorrect. Supervised fine-tuning is a process to further enhance a model by using a labeled dataset. You would not use regression models for large language models (LLMs) or in RLHF design.

        C Correct. RLHF is an ML technique that incorporates human feedback to help models learn more efficiently. Supervised fine-tuning of a language model is part of the RLHF process. You can use supervised fine-tuning to further enhance and tune a base language model.

        D Correct. RLHF is an ML technique that incorporates human feedback to help models learn more efficiently. Using a reward model is part of the RLHF process. You can either create your own reward model or use a reward model that is already created. Humans provide prompts and write responses that match different reward values. Then, you train a reward model to predict the reward value from the prompt and response. With RLHF, the goal is to train a separate Al reward model based on human feedback. Then, you use the model as a reward function to optimize policy through reinforcement learning.

        E Incorrect. MSE is an evaluation metric that you can use to evaluate how well a model predicts accurate results. You would typically use MSE to evaluate regression models. MSE is not related to RLHF.
      `,
      point: "20",
    },
  ],
} satisfies ReactQuiz;
