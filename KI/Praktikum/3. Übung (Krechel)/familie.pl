% Parent relations
parent(pam, bob).
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).
parent(pat, jim).

% Gender facts
male(tom).
male(bob).
male(pat).
male(jim).

female(pam).
female(liz).
female(ann).

% Grandparent relation
grandparent(GP, GC) :- parent(GP, P), parent(P, GC).

% Descendant relation
descendant(A, D) :- parent(A, D).
descendant(A, D) :- parent(A, X), descendant(X, D).

% Mother relation
mother(M, C) :- parent(M, C), female(M).

% Sister relation
sister(S, Sib) :- parent(P, S), parent(P, Sib), female(S), S \= Sib.

% Ancestor relation
ancestor(A, D) :- parent(A, D).
ancestor(A, D) :- parent(A, X), ancestor(X, D).


/***
% Who are Pat's parents?
?- parent(X, pat).

% Does Liz have a child?
?- parent(liz, X).

% Who are Pat's grandparents?
?- grandparent(X, pat).

% Who are Pat's descendants?
?- descendant(pat, X).

% Who is Pat's mother?
?- mother(X, pat).

% Who is Liz's sister?
?- sister(X, liz).

% Who are Jim's ancestors?
?- ancestor(X, jim).
***/