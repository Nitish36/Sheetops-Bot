from textblob import TextBlob
import spacy
import re

try:
    nlp = spacy.load("en_core_web_sm")
except:
    # Fallback for deployment environments
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

class UserBehaviorAnalyzer:
    def __init__(self):
        # Keywords that indicate high urgency
        self.urgency_keywords = ['urgent', 'asap', 'immediately', 'broken', 'emergency', 'help', 'fix', 'stop',
                                 'critical']

    def analyze_message(self, text):
        """
        Analyzes user behavior based on prompt text.
        Returns: A dictionary of behavioral insights.
        """
        # 1. Sentiment Analysis (-1.0 to 1.0)
        # -1 = Very Negative/Frustrated, 1 = Very Positive/Happy
        blob = TextBlob(text)
        sentiment = blob.sentiment.polarity

        # 2. Urgency Detection
        # Check for keywords and excessive exclamation marks
        urgency_score = 0
        text_lower = text.lower()

        for word in self.urgency_keywords:
            if word in text_lower:
                urgency_score += 1

        if '!' in text:
            urgency_score += 1
        if text.isupper():  # Detects SHOUTING
            urgency_score += 2

        # 3. Complexity Detection (Word count)
        word_count = len(text.split())
        complexity = "Simple"
        if word_count > 40:
            complexity = "High"
        elif word_count > 15:
            complexity = "Moderate"

        # 4. Behavioral Prediction / State
        user_state = "Neutral"
        if sentiment < -0.2:
            user_state = "Frustrated"
        elif sentiment > 0.5:
            user_state = "Satisfied/Polite"

        if urgency_score >= 2:
            user_state = "Anxious/Pressured"

        return {
            "sentiment_score": sentiment,
            "urgency_level": "High" if urgency_score >= 2 else "Normal",
            "complexity": complexity,
            "user_state": user_state,
            "word_count": word_count
        }

    def get_behavioral_context(self, text):
        """Returns a string to be injected into the AI system prompt."""
        analysis = self.analyze_message(text)

        context = f"\n[USER BEHAVIOR CONTEXT]\n"
        context += f"- State: {analysis['user_state']}\n"
        context += f"- Urgency: {analysis['urgency_level']}\n"
        context += f"- Complexity: {analysis['complexity']}\n"

        # Suggested AI adjustment
        if analysis['user_state'] == "Frustrated" or analysis['urgency_level'] == "High":
            context += "- Directive: User is under pressure. Skip pleasantries. Be direct, fast, and solution-oriented.\n"
        elif analysis['user_state'] == "Satisfied/Polite":
            context += "- Directive: User is friendly. You may maintain a more helpful, mentoring Lead Architect tone.\n"

        return context


class ActionItemExtractor:
    def __init__(self):
        # Action verbs that often start a task
        self.action_verbs = ["create", "update", "send", "email", "call", "finish", "complete", "draft", "fix", "setup",
                             "prepare"]

    def extract_entities(self, text):
        doc = nlp(text)

        extracted_data = {
            "tasks": [],
            "assignees": [],
            "deadlines": []
        }

        # 1. Extract PERSON (Assignees) and DATE (Deadlines)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                extracted_data["assignees"].append(ent.text)
            elif ent.label_ == "DATE":
                extracted_data["deadlines"].append(ent.text)

        # 2. Extract Tasks (Action Phrases)
        # We look for chunks that start with an action verb or follow a bullet point
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            # Check if line starts with a verb or common task markers
            is_task = any(line.lower().startswith(v) for v in self.action_verbs) or line.startswith(('-', '*', '•'))
            if is_task and len(line) > 5:
                # Clean up bullet points
                clean_task = re.sub(r'^[-*•]\s*', '', line)
                extracted_data["tasks"].append(clean_task)

        # De-duplicate
        extracted_data["assignees"] = list(set(extracted_data["assignees"]))
        extracted_data["deadlines"] = list(set(extracted_data["deadlines"]))

        return extracted_data

    def get_extraction_context(self, text):
        data = self.extract_entities(text)
        if not data["tasks"]:
            return ""

        context = f"\n[ENTITY EXTRACTION DATA]\n"
        context += f"- Tasks Found: {len(data['tasks'])}\n"
        context += f"- Potential Owners: {', '.join(data['assignees']) if data['assignees'] else 'None identified'}\n"
        context += f"- Potential Dates: {', '.join(data['deadlines']) if data['deadlines'] else 'None identified'}\n"
        context += "- Action: Offer to generate an 'Import Ready CSV'.\n"
        return context