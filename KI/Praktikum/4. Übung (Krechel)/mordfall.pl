% Fakten

% Alibi
alibi(georg, dienstag).
alibi(leo, dienstag).
alibi(wolfgang, donnerstag).

% Durch wen Alibi bestätigt
bestaetigt(bernd, georg, dienstag).
bestaetigt(bernd, leo, dienstag).
bestaetigt(georg, wolfgang, donnerstag).

% Person nicht glaubwürdig
nicht_glaubwuerdig(wolfgang).

% Person will sich rächen
raechen(paul, klaus).
raechen(georg, klaus).

% Erbe
erbe(bernd, klaus).
erbe(klaus, leo).

% Schulden
schulden(leo, klaus).
schulden(georg, klaus).

% Besitzt Pistole
besitzt_pistole(georg).
besitzt_pistole(leo).
besitzt_pistole(wolfgang).

% Überrascht bei Verbrechen
ueberrascht_bei_verbrechen(klaus, wolfgang).

% Regeln

% Bestätigtes Alibi
hat_bestaetigtes_alibi(Person, Tag) :-
    alibi(Person, Tag),
    bestaetigt(B, Person, Tag),
    \+nicht_glaubwuerdig(Person).

% Motiv
motiv(Person, Opfer) :-
    raechen(Person, Opfer).
motiv(Person, Opfer) :-
    erbe(Person, Opfer).
motiv(Person, Opfer) :-
    schulden(Person, Opfer).
motiv(Person, Opfer) :-
    ueberrascht_bei_verbrechen(Opfer, Person).

% Mörder
moerder(Person, Opfer, Tag) :-
    motiv(Person, Opfer),
    besitzt_pistole(Person),
    \+hat_bestaetigtes_alibi(Person, Tag).

% Hilfsprädikate zur Überprüfung der Fakten
has_motive(Person) :-
    motiv(Person, klaus).

owns_gun(Person) :-
    besitzt_pistole(Person).

no_alibi(Person, Tag) :-
    \+hat_bestaetigtes_alibi(Person, Tag).

% Mörder finden
loesefall(Moerder) :-
    moerder(Moerder, klaus, dienstag).

% Prädikat zum Lösen des Falls
solve_case(Moerder) :-
    loesefall(Moerder),
    write('The murderer is: '), write(Moerder), nl,
    write('Facts about the murderer:'), nl,
    (has_motive(Moerder) -> write(' - Has a motive'), nl; true),
    (owns_gun(Moerder) -> write(' - Owns a gun'), nl; true),
    (no_alibi(Moerder, dienstag) -> write(' - Has no alibi for the day of the murder'), nl; true).
    
/***
% Query um den Mörder zu finden
:- solve_case(_).
***/