package com.bks.dto;

import java.util.List;

public class ChatMessageResponse {

    public enum ResponseType {
        TEXT,
        ACTION,
        LISTE
    }

    private String reponse;
    private ResponseType type;
    private Object donnees;
    private List<String> suggestions;

    public ChatMessageResponse() {
        this.type = ResponseType.TEXT;
    }

    public ChatMessageResponse(String reponse) {
        this.reponse = reponse;
        this.type = ResponseType.TEXT;
    }

    public ChatMessageResponse(String reponse, ResponseType type, Object donnees, List<String> suggestions) {
        this.reponse = reponse;
        this.type = type;
        this.donnees = donnees;
        this.suggestions = suggestions;
    }

    public static ChatMessageResponse text(String reponse, List<String> suggestions) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setReponse(reponse);
        response.setType(ResponseType.TEXT);
        response.setSuggestions(suggestions);
        return response;
    }

    public static ChatMessageResponse action(String reponse, Object donnees, List<String> suggestions) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setReponse(reponse);
        response.setType(ResponseType.ACTION);
        response.setDonnees(donnees);
        response.setSuggestions(suggestions);
        return response;
    }

    public static ChatMessageResponse liste(String reponse, Object donnees, List<String> suggestions) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setReponse(reponse);
        response.setType(ResponseType.LISTE);
        response.setDonnees(donnees);
        response.setSuggestions(suggestions);
        return response;
    }

    public String getReponse() {
        return reponse;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }

    public ResponseType getType() {
        return type;
    }

    public void setType(ResponseType type) {
        this.type = type;
    }

    public Object getDonnees() {
        return donnees;
    }

    public void setDonnees(Object donnees) {
        this.donnees = donnees;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}
