% Alibi
alibi(georg, dienstag).
alibi(leo, dienstag).
alibi(wolfgang, donnerstag).


% Durch wenn Alibi bestätigt
bestaetigt(bernd, georg, dienstag).
bestaetigt(bernd, leo, dienstag).
bestaetigt(georg, wolfgang, donnerstag).


% Person nicht glaubwuerdig
nicht_glaubwuerdig(wolfgang).


% Person will sich rächen
raechen(paul, klaus).
raechen(georg, klaus).


% Bestätigtes Alibi
hat_bestaetigtes_alibi(Person, Tag) :-
    alibi(Person, Tag),
    bestaetigt(bernd, Person, Tag),
    \+nicht_glaubwuerdig(Person).
hat_bestaetigtes_alibi(Person, Tag) :-
    alibi(Person, Tag),
    bestaetigt(georg, Person, Tag),
    \+nicht_glaubwuerdig(Person).
