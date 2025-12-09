#! /usr/bin/env perl

use strict;
use v5.10;

# This script is only for maintainance.

use Chess::Plisco;
use File::Path;

sub read_tsv;
sub epd;

autoflush STDERR, 1;

if (-e 'chess-openings') {
	File::Path::remove_tree('chess-openings') or die;
}

print STDERR "cloning lichess-org/chess-openings.\n";

0 == system "git clone --depth 1 https://github.com/lichess-org/chess-openings.git"
	or die "cloning failed";

my %epds = (
	'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -' => {
		code => 'A00',
		name => 'Start position',
		moves => [],
	}
);
my @epds;

foreach my $basename (qw(a b c d e)) {
	my $filename = "chess-openings/$basename.tsv";
	warn "reading '$filename'.\n";
	read_tsv $filename;
}

print STDERR "finding moves\n";
foreach my $epd (@epds) {
	my $pos = Chess::Plisco->new($epd);
	my @legal = $pos->legalMoves;

	foreach my $move (@legal) {
		my $undo = $pos->doMove($move);
		my $next_epd = epd $pos->toFEN;
		$pos->undoMove($undo);
		if (exists $epds{$epd}) {
			push @{$epds{$epd}->{moves}}, $pos->moveCoordinateNotation($move);
		}
	}

	print STDERR "\r\tECO $epds{$epd}->{eco}";
}
print STDERR "\r";

print STDERR "writing positions\n";
open my $fh, '>', './src/chess/opening/eco.ts' or die $!;

$fh->print(<<"EOF");
// This file is generated. Do not edit! Edit '$0' instead!

export type ECOPosition = {
	eco: string;
	name: string;
	moves: string[];
};

export const eco = {
EOF

foreach my $epd (@epds) {
	my $moves = join ', ', map { qq('$_') } @{$epds{$epd}->{moves}};

	$fh->print(<<"EOF");
\t'$epd': {
\t\teco: '$epds{$epd}->{eco}',
\t\tname: "$epds{$epd}->{name}",
\t\tmoves: [$moves],
\t},
EOF
}

$fh->print("};\n");
$fh->close or die $!;

File::Path::remove_tree('chess-openings') or die;

print STDERR "done\n";

sub read_tsv {
	my ($filename) = @_;

	open my $fh, '<', $filename or die "$filename: $!";

	$fh->getline or die "$filename: $!";

	while (my $line = $fh->getline) {
		chomp $line;

		my ($code, $name, $moves) = split /\t+/, $line;
		my @premoves = grep { !/^[1-9][0-9]*\.$/ } split / +/, $moves;

		my $pos = Chess::Plisco->new;
		foreach my $move (@premoves) {
			eval {
				$pos->applyMove($move);
			};
			if ($@) {
				die "ECO $code: move: $move: $@";
			}
		}

		my $epd = epd $pos->toFEN;
		$epds{$epd} = {
			eco => $code,
			name => $name,
			moves => [],
		};
		push @epds, $epd;
	}
}

sub epd {
	my ($fen) = @_;

	my @tokens = split /[ \t]+/, $fen;
	while (@tokens > 4) {
		pop @tokens;
	}

	return join ' ', @tokens;
}
